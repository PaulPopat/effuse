using Effuse.Auth.Controllers.Models;
using Effuse.Auth.Integrations;
using Microsoft.AspNetCore.Mvc;

namespace Effuse.Auth.Controllers;

[ApiController]
[Route("user-staging")]
public class UserStagingController(IUserRepository userRepository) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> PostUserStaging([FromBody] PostUserStagingModel model)
    {
        await userRepository.StageUser(model.Email);
        return Created();
    }
}