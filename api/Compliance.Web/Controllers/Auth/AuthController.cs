using Microsoft.AspNetCore.Mvc;
using Compliance.Core.Interfaces;

namespace Compliance.Web.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _svc;
    public AuthController(IAuthService svc) => _svc = svc;

    [HttpGet]
    public async Task<IActionResult> Get() => Ok(new { service = await _svc.GetServiceNameAsync() });
}