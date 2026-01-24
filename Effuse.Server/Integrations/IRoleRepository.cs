using Effuse.Server.Domain;

namespace Effuse.Server.Integrations;

public interface IRoleRepository
{
  Task<Role> EnsureAdminRole();

  Task<Role> CreateRole(string name, List<Permission> permissions);

  Task<Role> UpdateRole(Role role);

  IAsyncEnumerable<Role> ListRoles();

  Task<Role> GetRole(Guid roleId);
}