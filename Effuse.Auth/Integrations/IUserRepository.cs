using Effuse.Auth.Domain;

namespace Effuse.Auth.Integrations;

public interface IUserRepository
{
    Task<User> CreateUser(CreateUserProps props);

    Task<User> GetUser(string userId);
}