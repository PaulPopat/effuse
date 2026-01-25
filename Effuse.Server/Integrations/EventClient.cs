using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using Effuse.Server.Authorisation;
using Effuse.Server.Domain;

namespace Effuse.Server.Integrations;

public class EventClient : IEventClient
{
  private static readonly List<(WebSocket socket, User user)> connections = [];

  public async Task Broadcast(object message, PermissionRequest permission)
  {
    var json = JsonSerializer.Serialize(message);
    var bytes = Encoding.UTF8.GetBytes(json);
    var segment = new ArraySegment<byte>(bytes, 0, bytes.Length);
    foreach (var (socket, user) in connections)
    {
      if (user.Role.HasPermission(permission))
      {
        continue;
      }

      await socket.SendAsync
      (
        segment,
        WebSocketMessageType.Text,
        true,
        CancellationToken.None
      );
    }
  }

  public async Task Register(WebSocket webSocket, User user)
  {
    var input = (webSocket, user);
    connections.Add(input);

    var buffer = new byte[1024 * 4];
    var receiveResult = await webSocket.ReceiveAsync
    (
      new ArraySegment<byte>(buffer),
      CancellationToken.None
    );

    while (!receiveResult.CloseStatus.HasValue)
    {
      receiveResult = await webSocket.ReceiveAsync
      (
        new ArraySegment<byte>(buffer),
        CancellationToken.None
      );
    }

    connections.Remove(input);
    await webSocket.CloseAsync
    (
      receiveResult.CloseStatus.Value,
      receiveResult.CloseStatusDescription,
      CancellationToken.None
    );
  }
}