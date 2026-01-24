namespace Effuse.Server.Controllers.Models;

public class PermissionModel
{
  public required string Action { get; set; }
  public required string Resource { get; set; }
}