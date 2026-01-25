using Effuse.Core.Errors;

namespace Effuse.Server.Authorisation;

public class Resource(string path, IDictionary<string, object?> actionArguments)
{
  public string Rendered => string.Join('/', path
    .Split('/')
    .Select(part =>
    {
      if (!part.StartsWith('{')) return part;
      var name = part.TrimStart('{').TrimEnd('}');
      var result = actionArguments[name];
      if (result == null || result is not string stringResult)
      {
        throw new UnauthorisedError("Unknown", "InvalidServerStructure");
      }

      return stringResult;
    }));
}