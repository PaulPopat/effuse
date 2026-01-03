using System.Globalization;
using Effuse.Auth.Controllers.Models;
using Effuse.Auth.Errors;
using Effuse.Auth.Integrations;
using Microsoft.AspNetCore.Mvc;

namespace Effuse.Auth.Controllers;

[ApiController]
[Route("me")]
public class MeController
(
    ISessionRepository sessionRepository,
    IProfileRepository profileRepository,
    IServerRepository serverRepository,
    IServerClient serverClient
) : ControllerBase
{

    [HttpGet("profile")]
    public async Task<IActionResult> GetUserProfileAsync()
    {
        var session = await sessionRepository.GetCurrentSession();
        var data = await profileRepository.GetUserProfile(session.User);

        return Ok(new
        {
            Username = session.User.Username,
            Biography = data.Biography,
            IconUrl = data.IconUrl,
        });
    }

    [HttpPut("profile/biography")]
    public async Task<IActionResult> PutUserProfileBiographyAsync([FromBody] PutBiographyModel model)
    {
        var session = await sessionRepository.GetCurrentSession();
        var data = await profileRepository.GetUserProfile(session.User);
        await profileRepository.UpdateUserProfile(new(session.User, model.Biography, data.IconUrl));

        return Ok(new
        {
            Username = session.User.Username,
            Biography = model.Biography,
            IconUrl = data.IconUrl,
        });
    }

    [HttpGet("servers")]
    public async Task<IActionResult> GetUserServersAsync()
    {
        var session = await sessionRepository.GetCurrentSession();
        var data = await serverRepository.GetUserServers(session.User);

        return Ok
        (
            data.Select
            (
                server => new
                {
                    ServerUrl = server.ServerUrl,
                    ServerName = server.ServerName,
                }
            )
            .ToList()
        );
    }

    [HttpPost("servers")]
    public async Task<IActionResult> PostUserServerAsync([FromBody] PostUserServerModel model)
    {
        var session = await sessionRepository.GetCurrentSession();
        if (!await serverClient.UserHasAccess(session.User, model.ServerUrl))
        {
            throw new UnauthorisedError("PostUserServer", "ServerAccessDenied");
        }

        await serverRepository.AddUserServer(session.User, model.ServerUrl, model.ServerName);

        return Ok(new { });
    }
}
