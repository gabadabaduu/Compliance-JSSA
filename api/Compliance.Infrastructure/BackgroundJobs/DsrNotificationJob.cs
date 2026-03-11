using Compliance.Core.Modules.HabeasData.Notificacion.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Compliance.Infrastructure.BackgroundJobs;

public class DsrNotificationJob : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<DsrNotificationJob> _logger;

    private static readonly TimeSpan ColombiaOffset = TimeSpan.FromHours(-5);

    public DsrNotificationJob(
        IServiceScopeFactory scopeFactory,
        ILogger<DsrNotificationJob> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("🕐 DsrNotificationJob iniciado");

        // Esperar 10 segundos para que la app termine de iniciar
        await Task.Delay(TimeSpan.FromSeconds(100), stoppingToken);

        // Ejecutar inmediatamente al arrancar (Render free plan: la app no corre 24/7)
        await RunJobAsync(stoppingToken, "INICIO DE APLICACIÓN");

        // Después, ejecutar cada 6 horas mientras la app esté corriendo
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await Task.Delay(TimeSpan.FromHours(6), stoppingToken);
            }
            catch (TaskCanceledException)
            {
                break;
            }

            await RunJobAsync(stoppingToken, "PERIÓDICA (6h)");
        }
    }

    private async Task RunJobAsync(CancellationToken stoppingToken, string motivo)
    {
        try
        {
            var colombiaTime = DateTime.UtcNow + ColombiaOffset;
            _logger.LogInformation("🚀 [{Motivo}] Ejecutando revisión DSR - {Hora} Colombia",
                motivo, colombiaTime.ToString("yyyy-MM-dd HH:mm:ss"));

            using var scope = _scopeFactory.CreateScope();
            var notificationService = scope.ServiceProvider.GetRequiredService<IDsrNotificationService>();

            await notificationService.CheckDsrDeadlinesAndNotifyAsync(stoppingToken);
            await notificationService.RetryFailedNotificationsAsync(stoppingToken);

            _logger.LogInformation("✅ [{Motivo}] Job completado exitosamente", motivo);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ [{Motivo}] Error ejecutando job de notificaciones DSR", motivo);
        }
    }
}