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

  public bool HasPermission(PermissionRequest request)
  {
    return permissions.Any(p => p.Allows(request));
  }

  public Role WithPermission(Permission permission)
  {
    return new
    (
      id: id,
      name: name,
      created_on: created_on,
      permissions: [.. permissions, permission]
    );
  }
}