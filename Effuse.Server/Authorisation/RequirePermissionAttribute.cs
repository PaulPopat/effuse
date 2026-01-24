namespace Effuse.Server.Authorisation;

[AttributeUsage(AttributeTargets.Method, Inherited = false, AllowMultiple = false)]
public class RequirePermissionAttribute(string action, string resource) : Attribute
{
  public string Action => action;

  public string Resource => resource;
}