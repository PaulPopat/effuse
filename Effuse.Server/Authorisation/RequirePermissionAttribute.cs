using System.Runtime.InteropServices;
using Effuse.Server.Domain;

namespace Effuse.Server.Authorisation;

[AttributeUsage(AttributeTargets.Method, Inherited = false, AllowMultiple = false)]
public class RequirePermissionAttribute(PermissionArea area, [Optional] string? modificationFrom) : Attribute
{
  public PermissionArea Area => area;

  public string? ModificationFrom => modificationFrom;
}