namespace Effuse.Auth.Integrations.Tables;

public class UserRow
{
    public const string Table = "users";

    public required string id { get; set; }
    public required string username { get; set; }
    public required string email { get; set; }
    public required string hashed_password { get; set; }
    public required DateTime created_on { get; set; }
    public required DateTime updated_on { get; set; }
}