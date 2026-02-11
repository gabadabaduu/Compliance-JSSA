using Compliance.Core.Modules.HabeasData.Notificacion.Interfaces;
using Compliance.Web.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Compliance.Infrastructure.Modules.HabeasData.Notificacion.Services;

public class DsrNotificationHubService : IDsrNotificationHubService
{
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly ILogger<DsrNotificationHubService> _logger;

    public DsrNotificationHubService(
        IHubContext<NotificationHub> hubContext,
        ILogger<DsrNotificationHubService> logger)
    {
        _hubContext = hubContext;
        _logger = logger;
    }

    public async Task NotifyUserAsync(string email, string message)
    {
        await _hubContext.Clients.Group($"email_{email}")
            .SendAsync("DsrNotificationsUpdated", new
            {
                type = "new",
                message,
                timestamp = DateTime.UtcNow
            });

        _logger.LogInformation("📡 WebSocket enviado a {Email}: {Message}", email, message);
    }

    public async Task NotifyCompanyAsync(string companyName, string message)
    {
        await _hubContext.Clients.Group($"empresa_{companyName}")
            .SendAsync("DsrNotificationsUpdated", new
            {
                type = "company_update",
                message,
                timestamp = DateTime.UtcNow
            });

        _logger.LogInformation("📡 WebSocket enviado a empresa {Company}: {Message}", companyName, message);
    }

    public async Task NotifyClearedAsync(string email)
    {
        await _hubContext.Clients.Group($"email_{email}")
            .SendAsync("DsrNotificationsCleared", new
            {
                type = "cleared",
                message = "Una solicitud ha sido cerrada",
                timestamp = DateTime.UtcNow
            });

        _logger.LogInformation("📡 WebSocket cleared enviado a {Email}", email);
    }

    public async Task NotifyMultipleUsersAsync(IEnumerable<string> emails, string message)
    {
        foreach (var email in emails)
        {
            await NotifyUserAsync(email, message);
        }
    }
}