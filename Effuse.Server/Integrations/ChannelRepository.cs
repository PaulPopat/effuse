using Effuse.Core.Errors;
using Effuse.Core.Integrations;
using Effuse.Core.Utils;
using Effuse.Server.Domain;
using Effuse.Server.Integrations.Tables;
using SqlKata.Execution;

namespace Effuse.Server.Integrations;

public class ChannelRepository
(
  QueryFactory db,
  GuidService guidService,
  DateTimeService dateTimeService
) : IChannelRepository
{
  private static Channel MakeChannel(ChannelRow row)
  {
    return row.type switch
    {
      "voice" => new VoiceChannel
      (
        id: row.id,
        name: row.name,
        createdOn: row.created_on
      ),
      "message" => new MessageChannel
      (
        id: row.id,
        name: row.name,
        createdOn: row.created_on
      ),
      _ => throw new Exception("Unhandled channel type"),
    };
  }

  public async Task<Channel> CreateChannel(string name, ChannelType type)
  {
    var now = dateTimeService.Now;
    var row = new ChannelRow
    {
      id = guidService.NewGuid,
      name = name,
      created_on = now,
      type = type.ToString(),
    };
    await db.Query(ChannelRow.TableName).InsertAsync(row);

    return MakeChannel(row);
  }

  public async Task<Channel> GetChannel(Guid id)
  {
    var entry = await db.Query(ChannelRow.TableName).Select("*").Where("id", id).SafeFirstOrDefault<ChannelRow>();
    if (entry == null)
    {
      throw new NotFoundError("GetChannel", id.ToString());
    }

    return MakeChannel(entry);
  }

  public async IAsyncEnumerable<Channel> ListChannels()
  {
    var entries = await db.Query(ChannelRow.TableName).Select("*").SafeGet<ChannelRow>();
    foreach (var entry in entries)
    {
      yield return MakeChannel(entry);
    }
  }
}