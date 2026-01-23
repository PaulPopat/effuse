using Effuse.Server.Domain;
using Effuse.Server.Integrations;

namespace Effuse.Server.Startup;

public class DefaultInviter(ITokenService tokenService, IRoleRepository roleRepository, IEnvService envService)
{
  public async Task CreateStartupInvite()
  {
    var role = await roleRepository.EnsureAdminRole();
    var token = await tokenService.CreateInviteToken(role);

    Console.WriteLine($"To join the server as an admin, go to {envService.UserInterfaceOrigin}/servers/join and enter {envService.ServerUrl} under 'Server URL' and {token} under 'Invite Token'");
  }
}