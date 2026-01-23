using Effuse.Auth.Domain;

namespace Effuse.Auth.Integrations;

public class ServerClient : IServerClient
{
    public async Task<bool> UserHasAccess(User user, string serverUrl, string inviteToken)
    {
        using var client = new HttpClient()
        {
            BaseAddress = new Uri(serverUrl),
        };

        using var response = await client.PostAsJsonAsync("/users", new
        {
            InviteToken = inviteToken,
            UserId = user.Id.ToString(),
        });

        return response.IsSuccessStatusCode;
    }
}