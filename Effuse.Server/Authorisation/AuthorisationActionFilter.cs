using System.Reflection;
using Effuse.Core.Errors;
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

    var attribute = descriptor.MethodInfo.GetCustomAttribute<RequirePermissionAttribute>();

    if (attribute == null)
    {
      throw new UnauthorisedError(context.HttpContext.Request.Path, "InvalidPermission");
    }

    var token = context.HttpContext.Request.Headers.Authorization.Single()?.Replace("Bearer ", string.Empty);
    if (token == null)
    {
      throw new UnauthorisedError(context.HttpContext.Request.Path, "InvalidPermission");
    }

    try
    {
      var action = attribute.Action;
      var resource = new Resource(attribute.Resource, context.ActionArguments);
      var request = new PermissionRequest(action, resource.Rendered);
      var user = await tokenService.ValidateAccessToken(token);
      if (!user.Role.Permissions.Any(p => p.Allows(request)))
      {
        throw new UnauthorisedError(context.HttpContext.Request.Path, "InvalidPermission");
      }

      await next();
    }
    catch (Exception err)
    {
      Console.WriteLine(err);
      throw new UnauthorisedError(context.HttpContext.Request.Path, "InvalidPermission");
    }
  }
}