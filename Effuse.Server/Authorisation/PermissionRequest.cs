namespace Effuse.Server.Authorisation;

public class PermissionRequest(string action, string resource)
{
  public string Action => action;

  public string Resource => resource;
}