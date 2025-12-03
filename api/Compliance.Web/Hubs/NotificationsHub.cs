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

        if (!string.IsNullOrEmpty(userId))
        {
            // Obtener la empresa del usuario
            var user = await _context.Users
                .Where(u => u.Id == Guid.Parse(userId))
                .Select(u => new { u.NombreEmpresa })
                .FirstOrDefaultAsync();

            // Agregar al grupo del usuario individual (para notificaciones directas)
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
            _logger.LogInformation("Usuario {UserId} agregado a grupo individual", userId);

            // Agregar al grupo de la empresa (para notificaciones de empresa)
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

        if (!string.IsNullOrEmpty(userId))
        {
            // Obtener la empresa del usuario
            var user = await _context.Users
                .Where(u => u.Id == Guid.Parse(userId))
                .Select(u => new { u.NombreEmpresa })
                .FirstOrDefaultAsync();

            // Remover del grupo individual
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");

            // Remover del grupo de empresa
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