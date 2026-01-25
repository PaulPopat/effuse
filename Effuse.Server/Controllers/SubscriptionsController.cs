using Effuse.Core.Integrations;
using Effuse.Server.Authorisation;
using Effuse.Server.Integrations;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Effuse.Server.Controllers;

[ApiController]
[Route("updates")]
public class SubscriptionsController
(
  IUserFetcher userFetcher,
  IEventClient eventClient
) : ControllerBase
{
  [EnableCors(Cors.EffuseOrigins)]
  [RequirePermission("updates:subscribe", "/")]
  [HttpGet]
  public async Task GetChannelListAsync()
  {
    if (!HttpContext.WebSockets.IsWebSocketRequest)
    {
      HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
      return;
    }

    using var socket = await HttpContext.WebSockets.AcceptWebSocketAsync();
    var user = await userFetcher.GetCurrentUser();
    await eventClient.Register(socket, user);
  }
}