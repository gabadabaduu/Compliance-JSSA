using Compliance.Core.Modules.HabeasData.Notificacion.Dtos;
using Compliance.Core.Modules.HabeasData.Notificacion.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Compliance.Web.Controllers.HabeasData;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DsrNotificationController : ControllerBase
{
    private readonly IDsrNotificationService _service;

    public DsrNotificationController(IDsrNotificationService service)
    {
        _service = service;
    }

    /// <summary>
    /// GET: api/dsrnotification/my?email=user@email.com
    /// </summary>
    [HttpGet("my")]
    public async Task<ActionResult<List<DsrNotificationDto>>> GetMyNotifications(
        [FromQuery] string email, CancellationToken ct)
    {
        if (string.IsNullOrEmpty(email))
            return BadRequest("Email es requerido");

        var notifications = await _service.GetNotificationsByEmailAsync(email, ct);
        return Ok(notifications);
    }

    /// <summary>
    /// GET: api/dsrnotification/my/count?email=user@email.com
    /// </summary>
    [HttpGet("my/count")]
    public async Task<ActionResult<int>> GetMyNotificationCount(
        [FromQuery] string email, CancellationToken ct)
    {
        if (string.IsNullOrEmpty(email))
            return BadRequest("Email es requerido");

        var count = await _service.GetUnreadCountAsync(email, ct);
        return Ok(count);
    }

    [HttpGet("dsr/{dsrId}")]
    public async Task<ActionResult<List<DsrNotificationDto>>> GetByDsrId(int dsrId, CancellationToken ct)
    {
        var notifications = await _service.GetNotificationsByDsrIdAsync(dsrId, ct);
        return Ok(notifications);
    }

    [HttpPost("check-deadlines")]
    public async Task<IActionResult> CheckDeadlines(CancellationToken ct)
    {
        await _service.CheckDsrDeadlinesAndNotifyAsync(ct);
        return Ok(new { message = "Revisión de vencimientos completada" });
    }
    
    [AllowAnonymous]
    [HttpPost("test-check-deadlines")]
    public async Task<IActionResult> TestCheckDeadlines(CancellationToken ct)
    {
        await _service.CheckDsrDeadlinesAndNotifyAsync(ct);
        return Ok(new { message = "Revisión de vencimientos completada" });
    }
    [HttpPost("retry-failed")]
    public async Task<IActionResult> RetryFailed(CancellationToken ct)
    {
        await _service.RetryFailedNotificationsAsync(ct);
        return Ok(new { message = "Reintento de envíos completado" });
    }
}