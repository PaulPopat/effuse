namespace Effuse.Server.Integrations.Tables;

public class UserRow
{
  public const string TableName = "users";

  public required Guid id { get; set; }
  public required DateTime created_on { get; set; }
  public required Guid role { get; set; }
}