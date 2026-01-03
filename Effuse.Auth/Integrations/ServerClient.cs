using Effuse.Auth.Domain;

namespace Effuse.Auth.Integrations;

public class ServerClient : IServerClient
{
    public Task<bool> UserHasAccess(User user, string serverUrl)
    {
        return Task.FromResult(true);
    }
}