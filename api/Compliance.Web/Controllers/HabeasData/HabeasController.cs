using Microsoft.AspNetCore.Mvc;
using Compliance.Core.Interfaces;

namespace Compliance.Web.Controllers;

[ApiController]
[Route("api/habeas")]
public class HabeasController : ControllerBase
{
    private readonly IHabeasService _svc;
    public HabeasController(IHabeasService svc) => _svc = svc;

    [HttpGet("requests")]
    public async Task<IActionResult> GetRequests() => Ok(new { service = await _svc.GetServiceNameAsync() });
}