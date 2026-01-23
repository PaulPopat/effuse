using System.Reflection;

namespace Effuse.Core.Integrations;

public class Env
{
    public static string GetEnvironmentVariable(string name)
    {
        return Environment.GetEnvironmentVariable(name) ?? throw new Exception($"{name} is required");
    }

    public static string GetAssetFile(string name)
    {
        var assembly = Assembly.GetExecutingAssembly();
        using var stream = assembly.GetManifestResourceStream(name) ?? throw new Exception($"Missing asset file {name}");
        using var reader = new StreamReader(stream);
        return reader.ReadToEnd();
    }
}