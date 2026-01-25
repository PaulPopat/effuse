namespace Effuse.Server.Integrations.Tables;

public class UserChannelRow
{
  public required Guid id { get; set; }
  public required Guid user { get; set; }
  public required Guid channel { get; set; }
}