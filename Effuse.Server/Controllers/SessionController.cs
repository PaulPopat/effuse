using Effuse.Core.Errors;
using Effuse.Core.Integrations;
using Effuse.Core.Utils;
using Effuse.Server.Controllers.Models;
using Effuse.Server.Domain;
using Effuse.Server.Integrations;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Effuse.Auth.Controllers;

[ApiController]
[Route("sessions")]
public class SessionController(IUserRepository userRepository, ITokenService tokenService, HttpContext context) : ControllerBase
{
  private object CreateSessionResponse(Role role)
  {
    return new
    {
      AccessToken = tokenService.CreateAccessToken(role),
      RefreshToken = tokenService.CreateRefreshToken(role),
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
    return Ok(CreateSessionResponse(user.Role));
  }

  [EnableCors(Cors.EffuseOrigins)]
  [HttpGet("refresh")]
  public async Task<IActionResult> GetRefreshSessionAsync()
  {
    var token = context.Request.Headers.Authorization.Single()?.Replace("Bearer ", string.Empty);
    if (token == null)
    {
      throw new UnauthorisedError(context.Request.Path, "InvalidPermission");
    }

    var role = await tokenService.ValidateRefreshToken(token);
    return Ok(CreateSessionResponse(role));
  }
}
