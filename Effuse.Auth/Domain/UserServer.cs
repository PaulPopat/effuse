namespace Effuse.Auth.Domain;

public class UserServer(User user, Guid id, string server_url, string server_name)
{
    public User User => user;
    public Guid Id => id;
    public string ServerUrl => server_url;
    public string ServerName => server_name;
}