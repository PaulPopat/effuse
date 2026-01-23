using Effuse.Core.Integrations;
using Effuse.Server.Authorisation;
using Effuse.Server.Controllers.Models;
using Effuse.Server.Domain;
using Effuse.Server.Integrations;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Effuse.Server.Controllers;

[ApiController]
[Route("roles")]
public class RoleController(IRoleRepository roleRepository) : ControllerBase
{
  private static object RoleModel(Role role)
  {
    return new
    {
      Id = role.Id.ToString(),
      Name = role.Name,
      Permissions = role.Permissions.Select(p => p.ToString()).ToList(),
    };
  }

  [EnableCors(Cors.EffuseOrigins)]
  [RequirePermission(Permission.ManageRoles)]
  [HttpPost]
  public async Task<IActionResult> PostRoleAsync([FromBody] PostRoleModel model)
  {
    var role = await roleRepository.CreateRole
    (
      model.Name,
      model.Permissions.Select(Enum.Parse<Permission>).ToList()
    );
    return Created("/roles/{roleId}", RoleModel(role));
  }

  [EnableCors(Cors.EffuseOrigins)]
  [RequirePermission(Permission.ViewRoles)]
  [HttpGet("{roleId}")]
  public async Task<IActionResult> GetRoleAsync(string roleId)
  {

    var role = await roleRepository.GetRole(Guid.Parse(roleId));
    return Ok(RoleModel(role));
  }

  [EnableCors(Cors.EffuseOrigins)]
  [RequirePermission(Permission.ManageRoles)]
  [HttpPut("{roleId}")]
  public async Task<IActionResult> PutRoleAsync(string roleId, [FromBody] PostRoleModel model)
  {
    var role = await roleRepository.GetRole(Guid.Parse(roleId));
    var result = new Role
    (
      id: role.Id,
      name: model.Name,
      created_on: role.CreatedOn,
      permissions: model.Permissions.Select(Enum.Parse<Permission>).ToList()
    );

    await roleRepository.UpdateRole(result);

    return Ok(RoleModel(result));
  }
}
