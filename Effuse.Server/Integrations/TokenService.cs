using System.Net.Http.Headers;
using Effuse.Core.Errors;
using Effuse.Core.Integrations;
using Effuse.Core.Utils;
using Effuse.Server.Domain;
using Effuse.Server.Integrations.Models;

namespace Effuse.Server.Integrations;

public class TokenService
(
  JwtService jwtService,
  IRoleRepository roleRepository,
  IUserRepository userRepository,
  IEnvService envService
) : ITokenService
{
  private const string AccessGrant = "Access";
  private const string InviteGrant = "Invite";
  private const string RefreshGrant = "Refresh";

  public async Task<string> CreateAccessToken(User user)
  {
    return jwtService.CreateToken(new Dictionary<string, string>()
    {
      ["Grant"] = AccessGrant,
      ["UserId"] = user.Id.ToString(),
    }, 15);
  }

  public async Task<string> CreateInviteToken(Role role)
  {
    return jwtService.CreateToken(new Dictionary<string, string>()
    {
      ["Grant"] = InviteGrant,
      ["RoleId"] = role.Id.ToString(),
    }, 15);
  }

  public async Task<string> CreateRefreshToken(User user)
  {
    return jwtService.CreateToken(new Dictionary<string, string>()
    {
      ["Grant"] = RefreshGrant,
      ["UserId"] = user.Id.ToString(),
    }, 7 * 24);
  }

  public async Task<User> ValidateAccessToken(string token)
  {
    try
    {
      var data = await jwtService.ParseToken(token);
      if (data.GetKeyNotNullable<string>("Grant") != AccessGrant) throw new Exception("Invalid Grant Type");

      var userId = data.GetKeyNotNullable<string>("UserId");
      return await userRepository.GetUser(Guid.Parse(userId));
    }
    catch (Exception error)
    {
      Console.Write(error);
      throw new UnauthorisedError("ValidateToken", "InvalidToken");
    }
  }

  public async Task<Role> ValidateInviteToken(string token)
  {
    try
    {
      var data = await jwtService.ParseToken(token);
      if (data.GetKeyNotNullable<string>("Grant") != InviteGrant) throw new Exception("Invalid Grant Type");

      var roleId = data.GetKeyNotNullable<string>("RoleId");
      return await roleRepository.GetRole(Guid.Parse(roleId));
    }
    catch (Exception error)
    {
      Console.Write(error);
      throw new UnauthorisedError("ValidateToken", "InvalidToken");
    }
  }

  public async Task<User> ValidateRefreshToken(string token)
  {
    try
    {
      var data = await jwtService.ParseToken(token);
      if (data.GetKeyNotNullable<string>("Grant") != RefreshGrant) throw new Exception("Invalid Grant Type");

      var userId = data.GetKeyNotNullable<string>("UserId");
      return await userRepository.GetUser(Guid.Parse(userId));
    }
    catch (Exception error)
    {
      Console.Write(error);
      throw new UnauthorisedError("ValidateToken", "InvalidToken");
    }
  }

  public async Task<Guid> ValidateServerToken(string token)
  {
    try
    {
      using var client = new HttpClient()
      {
        BaseAddress = new Uri(envService.EffuseUrl),
      };

      client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

      using var response = await client.GetAsync("/sessions/current");

      var responseData = await response.Content.ReadFromJsonAsync<ValidateServerTokenResponse>();
      if (responseData == null)
      {
        throw new Exception("Bad server response");
      }

      return Guid.Parse(responseData.UserId);
    }
    catch (Exception error)
    {
      Console.Write(error);
      throw new UnauthorisedError("ValidateServerToken", "InvalidToken");
    }
  }
}