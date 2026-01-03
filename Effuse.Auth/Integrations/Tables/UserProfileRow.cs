namespace Effuse.Auth.Integrations.Tables;

public class UserProfileRow
{
    public const string Table = "user_profiles";

    public int id { get; set; }
    public required Guid user_id { get; set; }
    public required string? biography { get; set; }
    public required string? icon_url { get; set; }
}