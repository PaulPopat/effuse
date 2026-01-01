namespace Effuse.Auth.Domain;

public class User(Guid id, string username, string email, DateTime created_on, DateTime updated_on)
{
    public Guid Id => id;

    public string Username => username;

    public string Email => email;

    public DateTime CreatedOn => created_on;

    public DateTime UpdatedOn => updated_on;
}