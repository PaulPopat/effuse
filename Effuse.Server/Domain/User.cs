namespace Effuse.Server.Domain;

public class User
(
  Guid id,
  DateTime created_on,
  Role role
)
{
  public Guid Id => id;

  public DateTime CreatedOn => created_on;

  public Role Role => role;

  public User WithRole(Role role)
  {
    return new
    (
      id: id,
      created_on: created_on,
      role: role
    );
  }
}