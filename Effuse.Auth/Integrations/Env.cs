namespace Effuse.Auth.Integrations;

public class Env
{
    private static string GetEnvironmentVariable(string name)
    {
        return Environment.GetEnvironmentVariable(name) ?? throw new Exception($"{name} is required");
    }

    public string EmailFrom => GetEnvironmentVariable("NOTIFICATION_EMAIL_FROM");
    public string VerificationEmailSubject => GetEnvironmentVariable("VERIFICATION_EMAIL_SUBJECT");
    public string VerificationEmailBody => GetEnvironmentVariable("VERIFICATION_EMAIL_BODY");
}