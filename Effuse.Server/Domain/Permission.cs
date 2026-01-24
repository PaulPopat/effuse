namespace Effuse.Server.Domain;

public class Permission(PermissionArea area, string modification)
{
  public PermissionArea Area => area;

  public string Modification => modification;

  public bool Allows(PermissionRequest request)
  {
    return request.Area == area && (request.Modification == modification || modification == "*");
  }
}