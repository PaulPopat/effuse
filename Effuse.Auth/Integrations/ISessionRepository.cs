using Effuse.Auth.Domain;

namespace Effuse.Auth.Integrations;

public interface ISessionRepository
{
    string CreateSession(User user, SessionPermission permission, int duration);
    Task<Session> ParseSession(string session);
    Task<Session> GetCurrentSession();
    Task<Session> GetIdentitySession();
    Task<Session> GetRefreshSession();
}