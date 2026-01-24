using Effuse.Server.Domain;

namespace Effuse.Server.Integrations;

public interface IChannelRepository
{
  Task<Channel> GetChannel(Guid id);

  IAsyncEnumerable<Channel> ListChannels();

  Task<Channel> CreateChannel(string name, ChannelType type);
}