using Effuse.Auth.Domain;

namespace Effuse.Auth.Integrations;

public interface IProfileRepository
{
    Task<UserProfile> GetUserProfile(User user);
    Task UpdateUserProfile(UserProfile userProfile);
}