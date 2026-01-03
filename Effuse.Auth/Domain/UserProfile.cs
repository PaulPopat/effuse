namespace Effuse.Auth.Domain;

public class UserProfile(User user, string? biography, string? icon_url)
{
    public User User => user;
    public string? Biography => biography;
    public string? IconUrl => icon_url;
}