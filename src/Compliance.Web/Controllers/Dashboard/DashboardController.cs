using Microsoft.AspNetCore.Mvc;
using Compliance.Core.Interfaces;

namespace Compliance.Web.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _svc;
    public DashboardController(IDashboardService svc) => _svc = svc;

    [HttpGet("metrics")]
    public async Task<IActionResult> GetMetrics() => Ok(new { service = await _svc.GetServiceNameAsync() });
}