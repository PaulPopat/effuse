using Effuse.Core.Errors;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Effuse.Core.Integrations;

public class JwtService(IJwtConfig config)
{
  private SymmetricSecurityKey SecurityKey => new(Encoding.UTF8.GetBytes(config.JwtKey));
  private SigningCredentials Credentials => new(SecurityKey, SecurityAlgorithms.HmacSha256);
  private static readonly JwtSecurityTokenHandler Handler = new();

  public string CreateToken(IDictionary<string, string> data, int duration)
  {
    var claims = new List<Claim>();
    foreach (var pair in data)
    {
      claims.Add(new Claim(pair.Key, pair.Value));
    }

    var token = new JwtSecurityToken
    (
        config.JwtIssuer,
        config.JwtIssuer,
        claims,
        expires: DateTime.UtcNow.AddMinutes(duration),
        signingCredentials: Credentials
    );

    return Handler.WriteToken(token);
  }

  public async Task<IDictionary<string, object>> ParseToken(string session)
  {
    var token = await Handler.ValidateTokenAsync(session, new()
    {
      IssuerSigningKey = SecurityKey,
      ValidAudience = config.JwtIssuer,
      ValidIssuer = config.JwtIssuer,
      ValidateLifetime = true,
      ValidateAudience = true,
      ValidateIssuer = true,
      ValidateIssuerSigningKey = true,
    });

    if (!token.IsValid) throw new UnauthorisedError("ParseSession", "InvalidJWT");
    
    return token.Claims;
  }
}