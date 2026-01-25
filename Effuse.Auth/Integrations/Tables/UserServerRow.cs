namespace Effuse.Auth.Integrations.Tables;

public class UserServerRow
{
    public const string Table = "user_servers";

    public required Guid id { get; set; }
    public required Guid user_id { get; set; }
    public required string server_url { get; set; }
    public required string server_name { get; set; }
}