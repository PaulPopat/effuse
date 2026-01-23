using Effuse.Server.Domain;

namespace Effuse.Server.Integrations;

public interface IRoleRepository
{
  Task<Role> EnsureAdminRole();

  Task<Role> CreateRole(string name, List<Permission> permissions);

  Task<Role> UpdateRole(Role role);

  Task<Role> GetRole(Guid roleId);

  Task<Role?> FindRoleWithPermission(Permission permission);
}