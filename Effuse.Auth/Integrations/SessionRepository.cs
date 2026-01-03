using Effuse.Auth.Domain;
using Effuse.Auth.Errors;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Effuse.Auth.Integrations;

public class SessionRepository(Env env, IUserRepository userRepository, HttpContext context)
{
    private SymmetricSecurityKey SecurityKey => new(Encoding.UTF8.GetBytes(env.JwtKey));
    private SigningCredentials Credentials => new(SecurityKey, SecurityAlgorithms.HmacSha256);
    private static readonly JwtSecurityTokenHandler Handler = new();

    public string CreateSession(User user, SessionPermission permission, int duration)
    {
        var claims = new[]
        {
             new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
             new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
             new Claim("Grant", permission.ToString())
         };

        var token = new JwtSecurityToken
        (
            env.JwtIssuer,
            env.JwtIssuer,
            claims,
            expires: DateTime.UtcNow.AddMinutes(duration),
            signingCredentials: Credentials
        );

        return Handler.WriteToken(token);
    }

    public async Task<Session> ParseSession(string session)
    {
        var token = await Handler.ValidateTokenAsync(session, new()
        {
            IssuerSigningKey = SecurityKey,
            ValidAudience = env.JwtIssuer,
            ValidIssuer = env.JwtIssuer,
            ValidateLifetime = true,
            ValidateAudience = true,
            ValidateIssuer = true,
            ValidateIssuerSigningKey = true,
        });

        if (!token.IsValid) throw new UnauthorisedError("ParseSession", "InvalidJWT");
        var sub = token.Claims.Single(c => c.Key == JwtRegisteredClaimNames.Sub).Value;
        var user = await userRepository.GetUser(Guid.Parse((string)sub));
        var permissionClaim = token.Claims.Single(c => c.Key == "Grant").Value;
        var permission = (SessionPermission)int.Parse((string)permissionClaim);
        var expClaim = token.Claims.Single(c => c.Key == JwtRegisteredClaimNames.Exp).Value;
        var exp = new DateTime(long.Parse((string)expClaim) * 1000);
        return new(user, exp, permission);
    }

    public async Task<Session> GetCurrentSession()
    {
        var request = context.Request;
        var token = (request.Headers.Authorization.Single()?.Split(' ')[1])
            ?? throw new UnauthorisedError("GetCurrentSession", "InvalidToken");
        
        return await ParseSession(token);
    }
}