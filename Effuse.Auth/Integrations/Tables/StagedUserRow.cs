namespace Effuse.Auth.Integrations.Tables;

public class StagedUserRow
{
    public const string Table = "users_staging";

    public required Guid id { get; set; }
    public required string email { get; set; }
}