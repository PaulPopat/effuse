using Effuse.Core.Integrations;

namespace Effuse.Auth.Integrations;

public class EnvService : IJwtConfig
{
    public string EmailFrom => Env.GetEnvironmentVariable("SMTP_EMAIL_FROM");
    public string VerificationEmailSubject => Env.GetAssetFile("Effuse.Auth.Assets.VerificationEmailSubject.txt");
    public string VerificationEmailBody => Env.GetAssetFile("Effuse.Auth.Assets.VerificationEmailBody.html");
    public string JwtKey => Env.GetEnvironmentVariable("JWT_KEY");
    public string JwtIssuer => Env.GetEnvironmentVariable("JWT_ISSUER");
}