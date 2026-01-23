namespace Effuse.Server.Controllers.Models;

public class PostUserModel
{
  public required string InviteToken { get; set; }
  public required string ServerToken { get; set; }
}