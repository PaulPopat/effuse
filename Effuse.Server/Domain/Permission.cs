using Effuse.Server.Authorisation;

namespace Effuse.Server.Domain;

public class Permission(string action, string resource)
{
  public string Action => action;

  public string Resource => resource;

  public bool Allows(PermissionRequest request)
  {
    var requestedResource = request.Resource.Split('/');
    foreach (var (req, res) in requestedResource.Zip(resource.Split('/')))
    {
      if (res == "*") break;
      if (req != res) return false;
    }

    if (action == "*") return true;

    var actionParts = request.Action.Split(':');

    if (action.Split(':')[0] != actionParts[0]) return false;
    if (action.Split(':')[1] != "*" && actionParts[1] != action.Split(':')[1]) return false;

    return true;
  }
}