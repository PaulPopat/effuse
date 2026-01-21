using System.Globalization;
using Effuse.Auth.Controllers.Models;
using Effuse.Auth.Integrations;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Effuse.Auth.Controllers;

[ApiController]
[Route("users")]
public class UserController(IUserRepository userRepository, IProfileRepository profileRepository) : ControllerBase
{
    [EnableCors(Cors.EffuseOrigins)]
    [HttpPost]
    public async Task<IActionResult> PostUserAsync([FromBody] PostUserModel model)
    {
        var data = await userRepository.CreateUser(new()
        {
            Username = model.Username,
            Email = model.Email,
            Password = model.Password,
            Verification = Guid.Parse(model.Verification)
        });

        return Created("/", new
        {
            Id = data.Id.ToString(),
            Username = data.Username,
            Email = data.Email,
            CreatedOn = data.CreatedOn.ToString("o", CultureInfo.InvariantCulture),
            UpdatedOn = data.UpdatedOn.ToString("o", CultureInfo.InvariantCulture),
        });
    }

    [EnableCors(Cors.EffuseOrigins)]
    [HttpGet("{userId}/profile")]
    public async Task<IActionResult> GetUserProfileAsync(string userId)
    {
        var user = await userRepository.GetUser(Guid.Parse(userId));
        var data = await profileRepository.GetUserProfile(user);

        return Ok(new
        {
            Username = user.Username,
            Biography = data.Biography,
            IconUrl = data.IconUrl,
        });
    }
}
