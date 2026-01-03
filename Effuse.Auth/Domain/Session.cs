namespace Effuse.Auth.Domain;

public class Session(User user, DateTime expires, SessionPermission permission)
{
    public User User => user;
    public DateTime Expires => expires;
    public SessionPermission Permission => permission;
}