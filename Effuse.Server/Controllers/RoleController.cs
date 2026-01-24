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
      Permissions = role.Permissions.Select(p => new { p.Action, p.Resource }).ToList(),
    };
  }

  [EnableCors(Cors.EffuseOrigins)]
  [RequirePermission("roles:create", "/")]
  [HttpPost]
  public async Task<IActionResult> PostRoleAsync([FromBody] PostRoleModel model)
  {
    var role = await roleRepository.CreateRole
    (
      model.Name,
      model.Permissions.Select(p => new Permission(p.Action, p.Resource)).ToList()
    );
    return Created("/roles/{roleId}", RoleModel(role));
  }

  [EnableCors(Cors.EffuseOrigins)]
  [RequirePermission("roles:list", "/")]
  [HttpGet]
  public async Task<IActionResult> GetRolesAsync()
  {
    var roles = roleRepository.ListRoles();
    return Ok(await roles.Select(RoleModel).ToListAsync());
  }

  [EnableCors(Cors.EffuseOrigins)]
  [RequirePermission("roles:getrole", "/{roleId}")]
  [HttpGet("{roleId}")]
  public async Task<IActionResult> GetRoleAsync(string roleId)
  {

    var role = await roleRepository.GetRole(Guid.Parse(roleId));
    return Ok(RoleModel(role));
  }

  [EnableCors(Cors.EffuseOrigins)]
  [RequirePermission("roles:update", "/{roleId}")]
  [HttpPut("{roleId}")]
  public async Task<IActionResult> PutRoleAsync(string roleId, [FromBody] PostRoleModel model)
  {
    var role = await roleRepository.GetRole(Guid.Parse(roleId));
    var result = new Role
    (
      id: role.Id,
      name: model.Name,
      created_on: role.CreatedOn,
      permissions: model.Permissions.Select(p => new Permission(p.Action, p.Resource)).ToList()
    );

    await roleRepository.UpdateRole(result);

    return Ok(RoleModel(result));
  }
}
