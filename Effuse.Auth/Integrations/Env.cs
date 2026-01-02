using System.Reflection;

namespace Effuse.Auth.Integrations;

public class Env
{
    private static string GetEnvironmentVariable(string name)
    {
        return Environment.GetEnvironmentVariable(name) ?? throw new Exception($"{name} is required");
    }

    private static string GetAssetFile(string name)
    {
        var assembly = Assembly.GetExecutingAssembly();
        using var stream = assembly.GetManifestResourceStream(name) ?? throw new Exception($"Missing asset file {name}");
        using var reader = new StreamReader(stream);
        return reader.ReadToEnd();
    }

    public string EmailFrom => GetEnvironmentVariable("SMTP_EMAIL_FROM");
    public string VerificationEmailSubject => GetAssetFile("./Assets/VerificationEmailSubject.txt");
    public string VerificationEmailBody => GetAssetFile("./Assets/VerificationEmailBody.html");
}