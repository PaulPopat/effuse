namespace Effuse.Auth.Controllers.Models;

public struct PostSessionModel
{
    public required string UsernameOrEmail { get; set; }
    public required string Password { get; set; }
}