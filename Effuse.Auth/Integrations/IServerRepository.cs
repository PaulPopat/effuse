using Effuse.Auth.Domain;

namespace Effuse.Auth.Integrations;

public interface IServerRepository
{
    Task<IList<UserServer>> GetUserServers(User user);

    Task<UserServer> AddUserServer(User user, string server_url, string server_name);
}