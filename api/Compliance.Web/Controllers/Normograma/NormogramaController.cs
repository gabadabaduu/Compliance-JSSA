using Microsoft.AspNetCore.Mvc;
using Compliance.Core.Interfaces;

namespace Compliance.Web.Controllers;

[ApiController]
[Route("api/normograma")]
public class NormogramaController : ControllerBase
{
    private readonly INormogramaService _svc;
    public NormogramaController(INormogramaService svc) => _svc = svc;

    [HttpGet]
    public async Task<IActionResult> Get() => Ok(new { service = await _svc.GetServiceNameAsync() });
}