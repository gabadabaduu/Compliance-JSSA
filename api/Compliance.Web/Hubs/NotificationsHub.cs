using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Compliance.Infrastructure.Data;

namespace Compliance.Web.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    private readonly ILogger<NotificationHub> _logger;
    private readonly AppDbContext _context;

    public NotificationHub(ILogger<NotificationHub> logger, AppDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst("sub")?.Value;
        var email = Context.User?.FindFirst("email")?.Value;

        if (!string.IsNullOrEmpty(userId))
        {
            var user = await _context.Users
                .Where(u => u.Id == Guid.Parse(userId))
                .Select(u => new { u.NombreEmpresa, u.Email })
                .FirstOrDefaultAsync();

            // Grupo individual por userId
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
            _logger.LogInformation("Usuario {UserId} agregado a grupo individual", userId);

            // Grupo individual por email (para notificaciones DSR)
            var userEmail = email ?? user?.Email;
            if (!string.IsNullOrEmpty(userEmail))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"email_{userEmail}");
                _logger.LogInformation("Usuario {UserId} agregado a grupo email: {Email}", userId, userEmail);
            }

            // Grupo de empresa
            if (!string.IsNullOrEmpty(user?.NombreEmpresa))
            {
                var empresaGroup = $"empresa_{user.NombreEmpresa}";
                await Groups.AddToGroupAsync(Context.ConnectionId, empresaGroup);
                _logger.LogInformation("Usuario {UserId} agregado a grupo de empresa: {Empresa}", userId, user.NombreEmpresa);
            }
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirst("sub")?.Value;
        var email = Context.User?.FindFirst("email")?.Value;

        if (!string.IsNullOrEmpty(userId))
        {
            var user = await _context.Users
                .Where(u => u.Id == Guid.Parse(userId))
                .Select(u => new { u.NombreEmpresa, u.Email })
                .FirstOrDefaultAsync();

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");

            var userEmail = email ?? user?.Email;
            if (!string.IsNullOrEmpty(userEmail))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"email_{userEmail}");
            }

            if (!string.IsNullOrEmpty(user?.NombreEmpresa))
            {
                var empresaGroup = $"empresa_{user.NombreEmpresa}";
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, empresaGroup);
            }

            _logger.LogInformation("Usuario {UserId} desconectado de SignalR", userId);
        }

        await base.OnDisconnectedAsync(exception);
    }
}