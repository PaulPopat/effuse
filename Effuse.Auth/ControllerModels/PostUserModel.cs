namespace Effuse.Auth.ControllerModels;

public struct PostUserModel
{
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string Verification { get; set; }
}