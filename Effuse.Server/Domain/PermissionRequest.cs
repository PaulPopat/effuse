namespace Effuse.Server.Domain;

public class PermissionRequest(PermissionArea area, string modification)
{
  public PermissionArea Area => area;

  public string Modification => modification;
}