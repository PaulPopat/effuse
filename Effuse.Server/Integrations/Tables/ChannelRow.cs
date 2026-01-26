namespace Effuse.Server.Integrations.Tables;

public class ChannelRow
{
  public const string TableName = "channels";

  public required Guid id { get; set; }
  public required string name { get; set; }
  public required DateTime created_on { get; set; }
  public required string type { get; set; }
}