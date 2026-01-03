using Effuse.Auth.Domain;
using Effuse.Auth.Integrations.Props;

namespace Effuse.Auth.Integrations;

public interface IUserRepository
{
    Task StageUser(string email);

    Task<User> CreateUser(CreateUserProps props);

    Task<User> GetUser(Guid userId);

    Task<User> FindUser(string usernameOrEmail, string password);
}