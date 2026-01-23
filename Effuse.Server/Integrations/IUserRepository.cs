using Effuse.Server.Domain;

namespace Effuse.Server.Integrations;

public interface IUserRepository
{
  Task<User> GetUser(Guid userId);

  Task<User> CreateUser(Guid userId, Role role);
}