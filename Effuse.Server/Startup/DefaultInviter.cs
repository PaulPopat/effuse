using System.Web;
using Effuse.Server.Integrations;

namespace Effuse.Server.Startup;

public class DefaultInviter(ITokenService tokenService, IRoleRepository roleRepository, IEnvService envService)
{
  public async Task CreateStartupInvite()
  {
    var role = await roleRepository.EnsureAdminRole();
    var token = await tokenService.CreateInviteToken(role);


    var query = HttpUtility.ParseQueryString(string.Empty);

    query.Add("server_url", envService.ServerUrl);
    query.Add("server_name", envService.ServerName);
    query.Add("invite_token", token);

    var url = new UriBuilder($"{envService.UserInterfaceOrigin}/servers/join")
    {
      Query = query.ToString()
    };

    Console.WriteLine($"To join the server as an admin, go to {url}");
  }
}