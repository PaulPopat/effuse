using Effuse.Server.Domain;

namespace Effuse.Server.Integrations;

public interface IVoiceServerManager
{
  Task<VoiceServer> ConnectToChannel(VoiceChannel channel);
}