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
[Route("users")]
public class UsersController
(
  ITokenService tokenService,
  IUserRepository userRepository,
  IRoleRepository roleRepository
) : ControllerBase
{
  private static object UserModel(User user)
  {
    return new
    {
      Id = user.Id,
      Username = user.Username,
      CreatedOn = user.CreatedOn.ToIsoString(),
      Role = new { RoleId = user.Role.Id.ToString(), RoleName = user.Role.Name }
    };
  }

  [EnableCors(Cors.EffuseOrigins)]
  [HttpPost]
  public async Task<IActionResult> PostUserAsync([FromBody] PostUserModel model)
  {
    var role = await tokenService.ValidateInviteToken(model.InviteToken);
    var userId = await tokenService.ValidateServerToken(model.ServerToken);
    var user = await userRepository.CreateUser(userId, role);

    return Created("/users/{userId}", UserModel(user));
  }

  [EnableCors(Cors.EffuseOrigins)]
  [RequirePermission(Permission.ViewUsers)]
  [HttpGet]
  public async Task<IActionResult> GetUsersAsync()
  {
    var users = await userRepository.ListUsers();
    return Ok(users.Select(UserModel).ToList());
  }

  [EnableCors(Cors.EffuseOrigins)]
  [RequirePermission(Permission.ViewUsers)]
  [HttpGet("{userId}")]
  public async Task<IActionResult> GetUserAsync(string userId)
  {
    var user = await userRepository.GetUser(Guid.Parse(userId));
    return Ok(UserModel(user));
  }

  [EnableCors(Cors.EffuseOrigins)]
  [RequirePermission(Permission.ManageRoles)]
  [HttpPut("{userId}/role")]
  public async Task<IActionResult> PutUserRoleAsync(string userId, [FromBody] PutUserRoleModel model)
  {
    var user = await userRepository.GetUser(Guid.Parse(userId));
    var role = await roleRepository.GetRole(Guid.Parse(model.RoleId));
    var result = user.WithRole(role);

    await userRepository.UpdateUser(result);
    return Ok(UserModel(result));
  }
}
