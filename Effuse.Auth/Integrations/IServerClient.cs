using Effuse.Auth.Domain;

namespace Effuse.Auth.Integrations;

public interface IServerClient
{
    Task<bool> UserHasAccess(User user, string serverUrl);
}