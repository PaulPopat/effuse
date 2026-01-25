using Effuse.Core.Errors;
using Effuse.Server.Domain;

namespace Effuse.Server.Integrations;

public class UserFetcher(ITokenService tokenService, IHttpContextAccessor httpContextAccessor) : IUserFetcher
{
  public async Task<User> GetCurrentUser()
  {
    var request = httpContextAccessor.HttpContext?.Request;
    var token = request?.Headers.Authorization.Single()?.Replace("Bearer ", string.Empty);
    if (token == null)
    {
      throw new UnauthorisedError(request?.Path ?? "Unknown", "InvalidPermission");
    }

    return await tokenService.ValidateAccessToken(token);
  }
}