using System.Globalization;
using Effuse.Auth.Controllers.Models;
using Effuse.Auth.Domain;
using Effuse.Auth.Integrations;
using Microsoft.AspNetCore.Mvc;

namespace Effuse.Auth.Controllers;

[ApiController]
[Route("sessions")]
public class SessionController(IUserRepository userRepository, ISessionRepository sessionRepository) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> PostSessionAsync([FromBody] PostSessionModel model)
    {
        var user = await userRepository.FindUser(model.UsernameOrEmail, model.Password);
        return Ok(new
        {
            AccessToken = sessionRepository.CreateSession(user, SessionPermission.Admin, 120),
            RefreshToken = sessionRepository.CreateSession(user, SessionPermission.Refresh, 60 * 48),
            ServerTokn = sessionRepository.CreateSession(user, SessionPermission.ReadUserId, 120),
            Expires = DateTime.UtcNow.AddMinutes(120).ToString("o", CultureInfo.InvariantCulture),
            TokenType = "Bearer",
        });
    }

    [HttpGet("current")]
    public async Task<IActionResult> GetCurrentSessionAsync()
    {
        var session = await sessionRepository.GetCurrentSession();
        return Ok(new
        {
            UserId = session.User.Id.ToString(),
        });
    }
}
