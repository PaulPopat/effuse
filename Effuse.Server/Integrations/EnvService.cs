using Effuse.Core.Integrations;

namespace Effuse.Server.Integrations;

public class EnvService : IJwtConfig
{
    public string JwtKey => Env.GetEnvironmentVariable("JWT_KEY");
    public string JwtIssuer => Env.GetEnvironmentVariable("JWT_ISSUER");
    public string UserInterfaceOrigin => Env.GetEnvironmentVariable("UI_ORIGIN");
}