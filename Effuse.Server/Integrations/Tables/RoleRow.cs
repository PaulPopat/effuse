namespace Effuse.Server.Integrations.Tables;

public class RoleRow
{
  public const string TableName = "roles";

  public required Guid id { get; set; }
  public required string name { get; set; }
  public required DateTime created_on { get; set; }
}