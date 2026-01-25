namespace Effuse.Server.Domain;

public class MessageChannel(Guid id, string name, DateTime createdOn) : Channel(id, name, createdOn)
{
  public override string TypeName => "message";
}