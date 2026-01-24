namespace Effuse.Server.Integrations.Tables;

public class RolePermissionRow
{
  public const string TableName = "role_permissions";

  public required Guid role { get; set; }
  public required string action { get; set; }
  public required string resource { get; set; }
}