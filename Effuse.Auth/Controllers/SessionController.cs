using System.Globalization;
using Effuse.Auth.Controllers.Models;
using Effuse.Auth.Domain;
using Effuse.Auth.Integrations;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Effuse.Auth.Controllers;

[ApiController]
[Route("sessions")]
public class SessionController(IUserRepository userRepository, ISessionRepository sessionRepository) : ControllerBase
{
    private object CreateSessionResponse(User user)
    {
        return new
        {
            AccessToken = sessionRepository.CreateSession(user, SessionPermission.Admin, 120),
            RefreshToken = sessionRepository.CreateSession(user, SessionPermission.Refresh, 60 * 48),
            ServerToken = sessionRepository.CreateSession(user, SessionPermission.ReadUserId, 120),
            Expires = DateTime.UtcNow.AddMinutes(120).ToString("o", CultureInfo.InvariantCulture),
            TokenType = "Bearer",
        };
    }

    [EnableCors(Cors.EffuseOrigins)]
    [HttpPost]
    public async Task<IActionResult> PostSessionAsync([FromBody] PostSessionModel model)
    {
        var user = await userRepository.FindUser(model.UsernameOrEmail, model.Password);
        return Ok(CreateSessionResponse(user));
    }

    [HttpGet("current")]
    public async Task<IActionResult> GetCurrentSessionAsync()
    {
        var session = await sessionRepository.GetIdentitySession();
        return Ok(new
        {
            UserId = session.User.Id.ToString(),
        });
    }

    [EnableCors(Cors.EffuseOrigins)]
    [HttpGet("refresh")]
    public async Task<IActionResult> GetRefreshSessionAsync()
    {
        var session = await sessionRepository.GetRefreshSession();
        return Ok(CreateSessionResponse(session.User));
    }
}
