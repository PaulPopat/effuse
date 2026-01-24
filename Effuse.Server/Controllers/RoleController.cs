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
      Permissions = role.Permissions.Select(p => new { Area = p.Area.ToString(), Modification = p.Modification }).ToList(),
    };
  }

  [EnableCors(Cors.EffuseOrigins)]
  [RequirePermission(PermissionArea.ManageRoles)]
  [HttpPost]
  public async Task<IActionResult> PostRoleAsync([FromBody] PostRoleModel model)
  {
    var role = await roleRepository.CreateRole
    (
      model.Name,
      model.Permissions.Select(p => new Permission(Enum.Parse<PermissionArea>(p.Area), p.Modification)).ToList()
    );
    return Created("/roles/{roleId}", RoleModel(role));
  }

  [EnableCors(Cors.EffuseOrigins)]
  [RequirePermission(PermissionArea.ManageRoles)]
  [HttpGet]
  public async Task<IActionResult> GetRolesAsync()
  {
    var roles = roleRepository.ListRoles();
    return Ok(await roles.Select(RoleModel).ToListAsync());
  }

  [EnableCors(Cors.EffuseOrigins)]
  [RequirePermission(PermissionArea.ViewRoles, "roleId")]
  [HttpGet("{roleId}")]
  public async Task<IActionResult> GetRoleAsync(string roleId)
  {

    var role = await roleRepository.GetRole(Guid.Parse(roleId));
    return Ok(RoleModel(role));
  }

  [EnableCors(Cors.EffuseOrigins)]
  [RequirePermission(PermissionArea.ManageRoles, "roleId")]
  [HttpPut("{roleId}")]
  public async Task<IActionResult> PutRoleAsync(string roleId, [FromBody] PostRoleModel model)
  {
    var role = await roleRepository.GetRole(Guid.Parse(roleId));
    var result = new Role
    (
      id: role.Id,
      name: model.Name,
      created_on: role.CreatedOn,
      permissions: model.Permissions.Select(p => new Permission(Enum.Parse<PermissionArea>(p.Area), p.Modification)).ToList()
    );

    await roleRepository.UpdateRole(result);

    return Ok(RoleModel(result));
  }
}
