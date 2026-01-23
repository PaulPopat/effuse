using Effuse.Auth.Domain;
using Effuse.Core.Errors;
using Effuse.Core.Integrations;
using Effuse.Core.Utils;
using System.IdentityModel.Tokens.Jwt;

namespace Effuse.Auth.Integrations;

public class SessionRepository(JwtService jwtService, IUserRepository userRepository, IHttpContextAccessor httpContextAccessor) : ISessionRepository
{
    public string CreateSession(User user, SessionPermission permission, int duration)
    {
        return jwtService.CreateToken(new Dictionary<string, string>()
        {
            [JwtRegisteredClaimNames.Sub] = user.Id.ToString(),
            ["UserId"] = user.Id.ToString(),
            ["Grant"] = permission.ToString()
        }, duration);
    }

    public async Task<Session> ParseSession(string session)
    {
        var data = await jwtService.ParseToken(session);
        return new
        (
            user: await userRepository.GetUser(Guid.Parse(data.GetKey<string>("UserId"))),
            expires: new DateTime(data.GetKey<long>(JwtRegisteredClaimNames.Exp) * 1000),
            permission: Enum.Parse<SessionPermission>(data.GetKey<string>("Grant"))
        );
    }

    private async Task<Session> GetSessionOfType(SessionPermission sessionPermission)
    {
        var request = (httpContextAccessor.HttpContext?.Request)
            ?? throw new UnauthorisedError("GetCurrentSession", "InvalidRequest");
        var token = (request.Headers.Authorization.Single()?.Split(' ')[1])
            ?? throw new UnauthorisedError("GetCurrentSession", "InvalidToken");

        var result = await ParseSession(token);
        if (result.Permission != sessionPermission)
        {
            throw new UnauthorisedError("GetCurrentSession", "InvalidPermissions");
        }

        return result;
    }

    public async Task<Session> GetCurrentSession()
    {
        return await GetSessionOfType(SessionPermission.Admin);
    }

    public async Task<Session> GetIdentitySession()
    {
        return await GetSessionOfType(SessionPermission.ReadUserId);
    }

    public async Task<Session> GetRefreshSession()
    {
        return await GetSessionOfType(SessionPermission.Refresh);
    }
}