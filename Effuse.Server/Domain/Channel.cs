namespace Effuse.Server.Domain;

public abstract class Channel(Guid id, string name, DateTime createdOn)
{
  public Guid Id => id;

  public string Name => name;

  public DateTime CreatedOn => createdOn;

  public abstract string TypeName { get; }
}