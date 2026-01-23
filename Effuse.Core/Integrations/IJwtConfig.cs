namespace Effuse.Core.Integrations;

public interface IJwtConfig
{
  string JwtKey { get; }
  string JwtIssuer { get; }
}