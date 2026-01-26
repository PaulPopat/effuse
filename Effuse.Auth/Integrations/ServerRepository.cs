using Effuse.Auth.Domain;
using Effuse.Auth.Integrations.Tables;
using Effuse.Core.Errors;
using Effuse.Core.Integrations;
using Effuse.Core.Utils;
using SqlKata.Execution;

namespace Effuse.Auth.Integrations;

public class ServerRepository(QueryFactory db, GuidService guidService) : IServerRepository
{
    public async Task<UserServer> AddUserServer(User user, string server_url, string server_name)
    {
        var existing = await db
            .Query(UserServerRow.Table)
            .Select("*")
            .Where("server_url", server_url)
            .Where("user_id", user.Id)
            .SafeGet<UserServerRow>();
        if (existing.Any())
        {
            throw new ConflictError("AddUserServer", "ServerAlreadyRegistered");
        }

        var id = guidService.NewGuid;

        await db.Query(UserServerRow.Table).InsertAsync(new UserServerRow
        {
            id = id,
            user_id = user.Id,
            server_url = server_url,
            server_name = server_name,
        });

        return new UserServer(user, id, server_url, server_name);
    }

    public async Task<IList<UserServer>> GetUserServers(User user)
    {
        var found = await db
            .Query(UserServerRow.Table)
            .Select("*")
            .Where("user_id", user.Id)
            .SafeGet<UserServerRow>();

        return found.Select(f => new UserServer(user, f.id, f.server_url, f.server_name)).ToList();
    }
}