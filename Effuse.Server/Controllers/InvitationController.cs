using Effuse.Core.Integrations;
using Effuse.Server.Authorisation;
using Effuse.Server.Controllers.Models;
using Effuse.Server.Domain;
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
    [RequirePermission(Permission.ManageRoles)]
    [HttpPost]
    public async Task<IActionResult> PostInvitationAsync([FromBody] PostInvitationModel model)
    {
        var role = await roleRepository.GetRole(Guid.Parse(model.RoleId));
        var token = await tokenService.CreateInviteToken(role);
        return Created("/users", new
        {
            InviteToken = token,
            ServerUrl = envService.ServerUrl,
        });
    }
}
