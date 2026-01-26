using Effuse.Core.Errors;
using Effuse.Core.Integrations;
using Effuse.Core.Utils;
using Effuse.Server.Authorisation;
using Effuse.Server.Controllers.Models;
using Effuse.Server.Domain;
using Effuse.Server.Integrations;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Effuse.Server.Controllers;

[ApiController]
[Route("sessions")]
public class SessionController
(
  IUserRepository userRepository,
  ITokenService tokenService,
  IHttpContextAccessor httpContextAccessor,
  IUserFetcher userFetcher
) : ControllerBase
{
  private HttpContext? Context => httpContextAccessor.HttpContext;

  private async Task<object> CreateSessionResponse(User user)
  {
    return new
    {
      AccessToken = await tokenService.CreateAccessToken(user),
      RefreshToken = await tokenService.CreateRefreshToken(user),
      Expires = DateTime.UtcNow.AddMinutes(120).ToIsoString(),
      TokenType = "Bearer",
    };
  }

  [EnableCors(Cors.EffuseOrigins)]
  [IsPublic]
  [HttpPost]
  public async Task<IActionResult> PostSessionAsync([FromBody] PostSessionModel model)
  {
    var userId = await tokenService.ValidateServerToken(model.ServerToken);
    var user = await userRepository.GetUser(userId);
    return Ok(await CreateSessionResponse(user));
  }

  [EnableCors(Cors.EffuseOrigins)]
  [IsPublic]
  [HttpGet("refresh")]
  public async Task<IActionResult> GetRefreshSessionAsync()
  {
    var token = Context?.Request.Headers.Authorization.Single()?.Replace("Bearer ", string.Empty);
    if (token == null)
    {
      throw new UnauthorisedError("GetRefreshSession", "InvalidPermission");
    }

    var user = await tokenService.ValidateRefreshToken(token);
    return Ok(await CreateSessionResponse(user));
  }

  [EnableCors(Cors.EffuseOrigins)]
  [RequirePermission("self:view", "/")]
  [HttpGet("permissions")]
  public async Task<IActionResult> GetSessionPermissionsAsync()
  {
    var user = await userFetcher.GetCurrentUser();

    return Ok(user.Role.Permissions.Select(p => new { p.Action, p.Resource }).ToList());
  }
}
