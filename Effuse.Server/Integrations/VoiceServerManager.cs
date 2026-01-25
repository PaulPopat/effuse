using Effuse.Server.Authorisation;
using Effuse.Server.Domain;

namespace Effuse.Server.Integrations;

public class VoiceServerManager(ITokenService tokenService, IEnvService envService) : IVoiceServerManager
{
  private static int port = 4000;
  private static readonly Dictionary<Guid, VoiceServer> servers = [];

  public async Task<VoiceServer> ConnectToChannel(VoiceChannel channel)
  {
    if (!servers.ContainsKey(channel.Id))
    {
      var request = new PermissionRequest("channels:join", $"/voice/{channel.Id}");
      var server = new VoiceServer(channel.Id, envService.ServerUrl, port++, async token =>
      {
        var u = await tokenService.ValidateAccessToken(token);
        return u.Role.HasPermission(request);
      });
    }

    return servers[channel.Id];
  }
}