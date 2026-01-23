namespace Effuse.Server.Domain;

public class Role
(
  Guid id,
  string name,
  DateTime created_on,
  List<Permission> permissions
)
{
  public Guid Id => id;

  public string Name => name;

  public DateTime CreatedOn => created_on;

  public List<Permission> Permissions => permissions;
}