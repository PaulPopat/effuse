using Effuse.Auth.Domain;
using Effuse.Auth.Errors;
using Effuse.Auth.Integrations.Tables;
using Effuse.Core.Integrations;
using Effuse.Core.Utils;
using SqlKata.Execution;

namespace Effuse.Auth.Integrations;

public class ProfileRepository(QueryFactory db, GuidService guidService) : IProfileRepository
{
    public async Task<UserProfile> GetUserProfile(User user)
    {
        var entry = await db
            .Query(UserProfileRow.Table)
            .Select("*")
            .Where("user_id", user.Id)
            .SafeFirstOrDefault<UserProfileRow>();

        if (entry == null)
        {
            return new(user, null, null);
        }

        return new(user, entry.biography, entry.icon_url);
    }

    public async Task UpdateUserProfile(UserProfile userProfile)
    {
        await db
            .Query(UserProfileRow.Table)
            .Where("user_id", userProfile.User.Id)
            .DeleteAsync();

        await db.Query(UserProfileRow.Table).InsertAsync(new UserProfileRow
        {
            id = guidService.NewGuid,
            user_id = userProfile.User.Id,
            biography = userProfile.Biography,
            icon_url = userProfile.IconUrl,
        });
    }
}