using Effuse.Auth.ControllerModels;
using Effuse.Auth.Integrations;
using Microsoft.AspNetCore.Mvc;

namespace Effuse.Auth.Controllers;

[ApiController]
[Route("user-staging")]
public class UserStagingController(IUserRepository userRepository) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> PostUserStaging([FromBody] PostUserModel model)
    {
        await userRepository.StageUser(model.Email);
        return Created();
    }
}