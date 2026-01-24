using Effuse.Core.Integrations;
using Effuse.Server.Authorisation;
using Effuse.Server.Integrations;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Effuse.Server.Controllers;

[ApiController]
[Route("invitations")]
public class InvitationController
(
    ITokenService tokenService,
    IRoleRepository roleRepository,
    IEnvService envService
) : ControllerBase
{
    [EnableCors(Cors.EffuseOrigins)]
    [RequirePermission("invitations:create", "/{roleId}")]
    [HttpGet("{roleId}")]
    public async Task<IActionResult> GetInvitationAsync(string roleId)
    {
        var role = await roleRepository.GetRole(Guid.Parse(roleId));
        var token = await tokenService.CreateInviteToken(role);
        return Created("/users", new
        {
            InviteToken = token,
            ServerUrl = envService.ServerUrl,
        });
    }
}
