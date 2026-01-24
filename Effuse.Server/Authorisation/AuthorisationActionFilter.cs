using System.Reflection;
using Effuse.Core.Errors;
using Effuse.Server.Domain;
using Effuse.Server.Integrations;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Effuse.Server.Authorisation;

public class AuthorisationActionFilter(ITokenService tokenService) : IAsyncActionFilter
{
  public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
  {
    if (context.ActionDescriptor is not ControllerActionDescriptor descriptor)
    {
      throw new UnauthorisedError(context.HttpContext.Request.Path, "InvalidPermission");
    }

    if (descriptor.MethodInfo.GetCustomAttribute<IsPublicAttribute>() != null)
    {
      await next();
      return;
    }

    var permission = descriptor.MethodInfo.GetCustomAttribute<RequirePermissionAttribute>()?.Permission ?? Permission.ManageRoles;

    var token = context.HttpContext.Request.Headers.Authorization.Single()?.Replace("Bearer ", string.Empty);
    if (token == null)
    {
      throw new UnauthorisedError(context.HttpContext.Request.Path, "InvalidPermission");
    }

    var user = await tokenService.ValidateAccessToken(token);
    if (!user.Role.Permissions.Any(p => p == permission))
    {
      throw new UnauthorisedError(context.HttpContext.Request.Path, "InvalidPermission");
    }

    await next();
  }
}