using Effuse.Core.Integrations;

namespace Effuse.Server.Integrations;

public class EnvService : IJwtConfig, IEnvService
{
    public string JwtKey => Env.GetEnvironmentVariable("JWT_KEY");
    public string JwtIssuer => Env.GetEnvironmentVariable("JWT_ISSUER");
    public string UserInterfaceOrigin => Env.GetEnvironmentVariable("UI_ORIGIN");
    public string ServerUrl => Env.GetEnvironmentVariable("SERVER_URL");
    public string EffuseUrl => Env.GetEnvironmentVariable("EFFUSE_URL");
}