using Effuse.Core.Errors;
using Effuse.Core.Integrations;
using Effuse.Server.Domain;
using Effuse.Server.Integrations.Tables;
using SqlKata.Execution;

namespace Effuse.Server.Integrations;

public class RoleRepository
(
  QueryFactory db,
  GuidService guidService,
  DateTimeService dateTimeService
) : IRoleRepository
{
  private async Task<Role> CreateFullRole(Guid id, string name, List<Permission> permissions)
  {
    var now = dateTimeService.Now;

    await db.Query(RoleRow.TableName).InsertAsync(new RoleRow
    {
      id = id,
      name = name,
      created_on = now,
    });

    foreach (var permission in permissions)
    {
      await db.Query(RolePermissionRow.TableName).InsertAsync(new RolePermissionRow
      {
        role = id,
        action = permission.Action,
        resource = permission.Resource,
      });
    }

    return new
    (
      id: id,
      name: name,
      created_on: now,
      permissions: permissions
    );
  }

  public async Task<Role> EnsureAdminRole()
  {
    var roleId = Guid.Parse("00000000-0000-0000-0000-000000000000");
    try
    {
      var found = await GetRole(roleId);
      if (!found.Permissions.Any(p => p.Action == "*" && p.Resource == "*"))
      {
        await UpdateRole(found.WithPermission(new("*", "*")));
      }

      return found;
    }
    catch
    {
      return await CreateFullRole(roleId, "ServerAdmin", [new("*", "*")]);
    }
  }

  public async Task<Role> CreateRole(string name, List<Permission> permissions)
  {
    return await CreateFullRole(guidService.NewGuid, name, permissions);
  }

  public async Task<Role?> FindRoleWithPermission(Permission permission)
  {
    var match = await db
      .Query(RolePermissionRow.TableName)
      .Select("*")
      .Where($"{RolePermissionRow.TableName}.permission", permission.ToString())
      .FirstOrDefaultAsync<RolePermissionRow>();

    if (match == null) return null;

    return await GetRole(match.role);
  }

  public async IAsyncEnumerable<Role> ListRoles()
  {
    var roleRows = await db
      .Query(RoleRow.TableName)
      .Select("*")
      .GetAsync<RoleRow>();

    foreach (var roleRow in roleRows)
    {

      var permissions = await db
        .Query(RolePermissionRow.TableName)
        .Select("*")
        .Where($"{RolePermissionRow.TableName}.role", roleRow.id)
        .GetAsync<RolePermissionRow>();

      yield return new
      (
        id: roleRow.id,
        name: roleRow.name,
        created_on: roleRow.created_on,
        permissions: permissions?
          .Select(r => new Permission(r.action, r.resource))
          .ToList() ?? []
      );
    }
  }

  public async Task<Role> GetRole(Guid roleId)
  {
    var roleRow = await db
      .Query(RoleRow.TableName)
      .Select("*")
      .Where($"{RoleRow.TableName}.id", roleId)
      .FirstOrDefaultAsync<RoleRow>();

    if (roleRow == null)
    {
      throw new NotFoundError("GetRole", roleId.ToString());
    }

    var permissions = await db
      .Query(RolePermissionRow.TableName)
      .Select("*")
      .Where($"{RolePermissionRow.TableName}.role", roleId)
      .GetAsync<RolePermissionRow>();

    return new
    (
      id: roleRow.id,
      name: roleRow.name,
      created_on: roleRow.created_on,
      permissions: permissions?
        .Select(r => new Permission(r.action, r.resource))
        .ToList() ?? []
    );
  }

  public async Task<Role> UpdateRole(Role role)
  {
    var existing = await db
      .Query(RoleRow.TableName)
      .Select("*")
      .Where($"{RoleRow.TableName}.id", role.Id)
      .FirstOrDefaultAsync<RoleRow>();

    if (existing == null)
    {
      throw new NotFoundError("GetRole", role.Id.ToString());
    }

    await db.Query(RoleRow.TableName).UpdateAsync(new RoleRow
    {
      id = role.Id,
      name = role.Name,
      created_on = existing.created_on,
    });

    await db
      .Query(RolePermissionRow.TableName)
      .Where($"{RolePermissionRow.TableName}.role", role.Id)
      .DeleteAsync();

    foreach (var permission in role.Permissions)
    {
      await db.Query(RolePermissionRow.TableName).InsertAsync(new RolePermissionRow
      {
        role = role.Id,
        action = permission.Action,
        resource = permission.Resource,
      });
    }

    return role;
  }
}