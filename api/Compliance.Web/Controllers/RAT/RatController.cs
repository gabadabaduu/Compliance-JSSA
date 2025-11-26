using Microsoft.AspNetCore.Mvc;
using Compliance.Core.Interfaces;

namespace Compliance.Web.Controllers;

[ApiController]
[Route("api/rat")]
public class RatController : ControllerBase
{
    private readonly IRatService _svc;
    public RatController(IRatService svc) => _svc = svc;

    [HttpGet("entities")]
    public async Task<IActionResult> GetEntities() => Ok(new { service = await _svc.GetServiceNameAsync() });

    [HttpGet("entities/{id:int}")]
    public async Task<IActionResult> GetEntity(int id) => Ok(new { service = await _svc.GetServiceNameAsync(), id });
}