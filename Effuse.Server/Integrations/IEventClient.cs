using System.Net.WebSockets;
using Effuse.Server.Authorisation;
using Effuse.Server.Domain;

namespace Effuse.Server.Integrations;

public interface IEventClient
{
  Task Register(WebSocket webSocket, User user);

  Task Broadcast(object message, PermissionRequest permission);
}