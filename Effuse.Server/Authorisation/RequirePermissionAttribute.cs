using Effuse.Core.Errors;
using Effuse.Server.Domain;
using Effuse.Server.Integrations;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Effuse.Server.Authorisation;

[AttributeUsage(AttributeTargets.Method, Inherited = false, AllowMultiple = false)]
public class RequirePermissionAttribute(Permission permission) : ActionFilterAttribute
{
  public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
  {
    var token = context.HttpContext.Request.Headers.Authorization.Single()?.Replace("Bearer ", string.Empty);
    if (token == null)
    {
      throw new UnauthorisedError(context.HttpContext.Request.Path, "InvalidPermission");
    }

    var tokenService = context.HttpContext.RequestServices.GetService<ITokenService>();
    if (tokenService == null)
    {
      throw new UnauthorisedError(context.HttpContext.Request.Path, "InternalServerError");
    }

    var role = await tokenService.ValidateAccessToken(token);
    if (!role.Permissions.Any(p => p == permission))
    {
      throw new UnauthorisedError(context.HttpContext.Request.Path, "InvalidPermission");
    }

    await base.OnActionExecutionAsync(context, next);
  }
}