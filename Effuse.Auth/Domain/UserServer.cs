namespace Effuse.Auth.Domain;

public class UserServer(User user, string server_url, string server_name)
{
    public User User => user;
    public string ServerUrl => server_url;
    public string ServerName => server_name;
}