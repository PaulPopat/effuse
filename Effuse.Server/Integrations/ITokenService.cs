using Effuse.Server.Domain;

namespace Effuse.Server.Integrations;

public interface ITokenService
{
  Task<string> CreateInviteToken(Role role);

  Task<string> CreateAccessToken(Role role);

  Task<string> CreateRefreshToken(Role role);

  Task<Role> ValidateInviteToken(string token);

  Task<Role> ValidateRefreshToken(string token);

  Task<Role> ValidateAccessToken(string token);

  Task<Guid> ValidateServerToken(string token);
}