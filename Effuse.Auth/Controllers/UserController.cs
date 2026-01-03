using System.Globalization;
using Effuse.Auth.Controllers.Models;
using Effuse.Auth.Integrations;
using Microsoft.AspNetCore.Mvc;

namespace Effuse.Auth.Controllers;

[ApiController]
[Route("users")]
public class UserController(IUserRepository userRepository) : ControllerBase
{
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

        return Created(this.Url.Action("GetUserAsync", new { userId = data.Id.ToString() }), new
        {
            Id = data.Id.ToString(),
            Username = data.Username,
            Email = data.Email,
            CreatedOn = data.CreatedOn.ToString("o", CultureInfo.InvariantCulture),
            UpdatedOn = data.UpdatedOn.ToString("o", CultureInfo.InvariantCulture),
        });
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetUserAsync(string userId)
    {
        var data = await userRepository.GetUser(userId);

        return Ok(new
        {
            Id = data.Id.ToString(),
            Username = data.Username,
            Email = data.Email,
            CreatedOn = data.CreatedOn.ToString("o", CultureInfo.InvariantCulture),
            UpdatedOn = data.UpdatedOn.ToString("o", CultureInfo.InvariantCulture),
        });
    }
}
