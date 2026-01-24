using Effuse.Core.Utils;

namespace Effuse.Server.Authorisation;

public class Resource(string path, IDictionary<string, object?> actionArguments)
{
  public string Rendered => string.Join('/', path
    .Split('/')
    .Select(part =>
    {
      if (!part.StartsWith('{')) return part;
      var name = part.TrimStart('{').TrimEnd('}');
      return actionArguments.GetKey<string>(name);
    }));
}