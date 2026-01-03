namespace Effuse.Auth.Controllers.Models;

public struct PostUserServerModel
{
    public required string ServerUrl { get; set; }
    public required string ServerName { get; set; }
}