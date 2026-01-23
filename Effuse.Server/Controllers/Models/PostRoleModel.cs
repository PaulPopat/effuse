namespace Effuse.Server.Controllers.Models;

public class PostRoleModel
{
  public required string Name { get; set; }
  public required List<string> Permissions { get; set; }
}