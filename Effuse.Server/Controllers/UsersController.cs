using Effuse.Core.Integrations;
using Effuse.Core.Utils;
using Effuse.Server.Controllers.Models;
using Effuse.Server.Integrations;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Effuse.Server.Controllers;

[ApiController]
[Route("users")]
public class UsersController
(
  ITokenService tokenService,
  IUserRepository userRepository
) : ControllerBase
{
  [EnableCors(Cors.EffuseOrigins)]
  [HttpPost]
  public async Task<IActionResult> PostUserAsync([FromBody] PostUserModel model)
  {
    var role = await tokenService.ValidateInviteToken(model.InviteToken);
    var userId = await tokenService.ValidateServerToken(model.ServerToken);
    var user = await userRepository.CreateUser(userId, role);

    return Created("/users/{userId}", new
    {
      Id = user.Id,
      Username = user.Username,
      CreatedOn = user.CreatedOn.ToIsoString(),
    });
  }
}
