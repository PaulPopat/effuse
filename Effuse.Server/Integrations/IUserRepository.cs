using Effuse.Server.Domain;

namespace Effuse.Server.Integrations;

public interface IUserRepository
{
  IAsyncEnumerable<User> ListUsers();

  Task<User> GetUser(Guid userId);

  Task<User> CreateUser(Guid userId, Role role);

  Task<User> UpdateUser(User user);
}