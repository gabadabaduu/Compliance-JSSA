using Microsoft.AspNetCore.Mvc;
using Compliance.Core.Interfaces;

namespace Compliance.Web.Controllers;

[ApiController]
[Route("api/epid")]
public class EpidController : ControllerBase
{
    private readonly IEpidService _svc;
    public EpidController(IEpidService svc) => _svc = svc;

    [HttpGet]
    public async Task<IActionResult> Get() => Ok(new { service = await _svc.GetServiceNameAsync() });
}