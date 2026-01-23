using Effuse.Server.Domain;

namespace Effuse.Server.Integrations;

public interface IRoleRepository
{
  Task<Role> GetRole(Guid roleId);
}