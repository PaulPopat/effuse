using Effuse.Server.Domain;

namespace Effuse.Server.Integrations;

public interface ITokenService
{
  Task<string> CreateInviteToken(Role role);

  Task<string> CreateAccessToken(User user);

  Task<string> CreateRefreshToken(User user);

  Task<Role> ValidateInviteToken(string token);

  Task<User> ValidateRefreshToken(string token);

  Task<User> ValidateAccessToken(string token);

  Task<Guid> ValidateServerToken(string token);
}