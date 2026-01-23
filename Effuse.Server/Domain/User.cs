namespace Effuse.Server.Domain;

public class User
(
  Guid id,
  string username,
  string? biography,
  DateTime created_on,
  Role role
)
{
  public Guid Id => id;

  public string Username => username;

  public string? Biography => biography;

  public DateTime CreatedOn => created_on;

  public Role Role => role;
}