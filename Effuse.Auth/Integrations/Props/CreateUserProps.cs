namespace Effuse.Auth.Integrations.Props;

public struct CreateUserProps
{
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required Guid Verification { get; set; }
}