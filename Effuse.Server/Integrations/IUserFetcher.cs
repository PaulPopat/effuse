using Effuse.Server.Domain;

namespace Effuse.Server.Integrations;

public interface IUserFetcher
{
  Task<User> GetCurrentUser();
}