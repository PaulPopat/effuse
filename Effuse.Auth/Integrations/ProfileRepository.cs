using Effuse.Auth.Domain;
using Effuse.Auth.Errors;
using Effuse.Auth.Integrations.Tables;
using SqlKata.Execution;

namespace Effuse.Auth.Integrations;

public class ProfileRepository(QueryFactory db) : IProfileRepository
{
    public async Task<UserProfile> GetUserProfile(User user)
    {
        var found = await db
            .Query(UserProfileRow.Table)
            .Select("*")
            .Where("user_id", user.Id)
            .GetAsync<UserProfileRow>();

        var entry = found.SingleOrDefault();
        if (entry == null)
        {
            return new(user, null, null);
        }

        return new(user, entry.biography, entry.icon_url);
    }

    public async Task UpdateUserProfile(UserProfile userProfile)
    {
        var found = await db
            .Query(UserProfileRow.Table)
            .Select("*")
            .Where("user_id", userProfile.User.Id)
            .GetAsync<UserProfileRow>();

        var entry = found.SingleOrDefault();
        if (entry == null)
        {
            await db.Query(UserProfileRow.Table).InsertAsync(new UserProfileRow
            {
                user_id = userProfile.User.Id,
                biography = userProfile.Biography,
                icon_url = userProfile.IconUrl,
            });

            return;
        }

        await db.Query(UserProfileRow.Table).UpdateAsync(new UserProfileRow
        {
            id = entry.id,
            user_id = userProfile.User.Id,
            biography = userProfile.Biography,
            icon_url = userProfile.IconUrl,
        });
    }
}