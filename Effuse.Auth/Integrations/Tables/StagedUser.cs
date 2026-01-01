namespace Effuse.Auth.Integrations.Tables;

public class StagedUser
{
    public required Guid id { get; set; }
    public required string email { get; set; }
}