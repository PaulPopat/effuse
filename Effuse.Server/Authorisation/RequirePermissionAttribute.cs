using Effuse.Server.Domain;

namespace Effuse.Server.Authorisation;

[AttributeUsage(AttributeTargets.Method, Inherited = false, AllowMultiple = false)]
public class RequirePermissionAttribute(Permission permission) : Attribute
{
  public Permission Permission => permission;
}