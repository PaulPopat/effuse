using Effuse.Core.Errors;
using Effuse.Core.Integrations;
using Effuse.Core.Utils;
using Effuse.Server.Controllers.Models;
using Effuse.Server.Domain;
using Effuse.Server.Integrations;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Effuse.Server.Controllers;

[ApiController]
[Route("sessions")]
public class SessionController(IUserRepository userRepository, ITokenService tokenService, IHttpContextAccessor httpContextAccessor) : ControllerBase
{
  private HttpContext? Context => httpContextAccessor.HttpContext;

  private async Task<object> CreateSessionResponse(Role role)
  {
    return new
    {
      AccessToken = await tokenService.CreateAccessToken(role),
      RefreshToken = await tokenService.CreateRefreshToken(role),
      Expires = DateTime.UtcNow.AddMinutes(120).ToIsoString(),
      TokenType = "Bearer",
    };
  }

  [EnableCors(Cors.EffuseOrigins)]
  [HttpPost]
  public async Task<IActionResult> PostSessionAsync([FromBody] PostSessionModel model)
  {
    var userId = await tokenService.ValidateServerToken(model.ServerToken);
    var user = await userRepository.GetUser(userId);
    return Ok(await CreateSessionResponse(user.Role));
  }

  [EnableCors(Cors.EffuseOrigins)]
  [HttpGet("refresh")]
  public async Task<IActionResult> GetRefreshSessionAsync()
  {
    var token = Context?.Request.Headers.Authorization.Single()?.Replace("Bearer ", string.Empty);
    if (token == null)
    {
      throw new UnauthorisedError("GetRefreshSession", "InvalidPermission");
    }

    var role = await tokenService.ValidateRefreshToken(token);
    return Ok(await CreateSessionResponse(role));
  }
}
