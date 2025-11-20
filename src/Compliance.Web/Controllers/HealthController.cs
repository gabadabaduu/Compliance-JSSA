using Microsoft.AspNetCore.Mvc;

namespace Compliance.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "healthy",
            timestamp = DateTime.UtcNow,
            version = "1.0.0",
            environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"),
            modules = new[]
            {
                "Auth",
                "RAT",
                "Habeas Data",
                "EPID",
                "Risk Matrix",
                "Normograma",
                "Dashboard"
            }
        });
    }
}