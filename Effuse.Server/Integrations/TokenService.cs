using System.Net.Http.Headers;
using Effuse.Core.Errors;
using Effuse.Core.Integrations;
using Effuse.Core.Utils;
using Effuse.Server.Domain;
using Effuse.Server.Integrations.Models;

namespace Effuse.Server.Integrations;

public class TokenService(JwtService jwtService, IRoleRepository roleRepository, IEnvService envService) : ITokenService
{
  private async Task<Role> ValidateAs(string token, string expect)
  {
    try
    {
      var data = await jwtService.ParseToken(token);
      if (data.GetKey<string>("Grant") != expect) throw new Exception("Invalid Access Type");

      var roleId = data.GetKey<string>("RoleId");
      var role = await roleRepository.GetRole(Guid.Parse(roleId));
      return role;
    }
    catch (Exception error)
    {
      Console.Write(error);
      throw new UnauthorisedError("ValidateToken", "InvalidToken");
    }
  }


  public async Task<string> CreateAccessToken(Role role)
  {
    return jwtService.CreateToken(new Dictionary<string, string>()
    {
      ["Grant"] = "Access",
      ["RoleId"] = role.Id.ToString(),
    }, 15);
  }

  public async Task<string> CreateInviteToken(Role role)
  {
    return jwtService.CreateToken(new Dictionary<string, string>()
    {
      ["Grant"] = "Invite",
      ["RoleId"] = role.Id.ToString(),
    }, 15);
  }

  public async Task<string> CreateRefreshToken(Role role)
  {
    return jwtService.CreateToken(new Dictionary<string, string>()
    {
      ["Grant"] = "Refresh",
      ["RoleId"] = role.Id.ToString(),
    }, 7 * 24);
  }

  public Task<Role> ValidateAccessToken(string token)
  {
    return ValidateAs(token, "Access");
  }
  public Task<Role> ValidateInviteToken(string token)
  {
    return ValidateAs(token, "Invite");
  }

  public Task<Role> ValidateRefreshToken(string token)
  {
    return ValidateAs(token, "Refresh");
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