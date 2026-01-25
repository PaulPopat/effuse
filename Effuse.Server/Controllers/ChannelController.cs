using Effuse.Core.Errors;
using Effuse.Core.Integrations;
using Effuse.Core.Utils;
using Effuse.Server.Authorisation;
using Effuse.Server.Controllers.Models;
using Effuse.Server.Domain;
using Effuse.Server.Integrations;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Effuse.Server.Controllers;

[ApiController]
[Route("channels")]
public class ChannelController
(
  IChannelRepository channelRepository,
  IUserFetcher userFetcher,
  IUserRepository userRepository
) : ControllerBase
{
  private static object ChannelModel(Channel channel)
  {
    return new
    {
      Id = channel.Id.ToString(),
      Name = channel.Name,
      Type = channel.TypeName,
      CreatedOn = channel.CreatedOn.ToIsoString(),
    };
  }

  private static bool UserMayAccessChannel(User user, Channel channel)
  {
    return user.Role.HasPermission(new PermissionRequest("channels:view", $"/{channel.TypeName}/{channel.Id}"));
  }

  [EnableCors(Cors.EffuseOrigins)]
  [RequirePermission("channels:list", "/")]
  [HttpGet]
  public async Task<IActionResult> GetChannelListAsync()
  {
    var user = await userFetcher.GetCurrentUser();
    var channels = await channelRepository
      .ListChannels()
      .Where(c => UserMayAccessChannel(user, c))
      .Select(ChannelModel)
      .ToListAsync();

    return Ok(channels);
  }

  [EnableCors(Cors.EffuseOrigins)]
  [RequirePermission("channels:create", "/{channelType}")]
  [HttpPost("/{channelType}")]
  public async Task<IActionResult> PostChannelAsync(string channelType, [FromBody] PostChannelModel model)
  {
    var type = channelType switch
    {
      "voice" => ChannelType.voice,
      "message" => ChannelType.message,
      _ => throw new NotFoundError("PostChannelAsync", channelType),
    };

    var channel = await channelRepository.CreateChannel(model.Name, type);

    return Created("/channels/{channelType}/{channelId}", ChannelModel(channel));
  }

  [EnableCors(Cors.EffuseOrigins)]
  [RequirePermission("channels:listusers", "/{channelType}/{channelId}")]
  [HttpGet("/{channelType}/{channelId}/users")]
  public async Task<IActionResult> GetChannelUsersAsync(string channelType, string channelId)
  {
    var channel = await channelRepository.GetChannel(Guid.Parse(channelId));
    if (channel.TypeName != channelType)
    {
      throw new NotFoundError("GetChannelUsers", channelId);
    }

    var users = userRepository.ListUsers().Where(u => UserMayAccessChannel(u, channel));

    return Ok(await users.Select(u => new { UserId = u.Id }).ToListAsync());
  }
}