using Compliance.Core.Modules.HabeasData.Notificacion.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Compliance.Infrastructure.BackgroundJobs;

public class DsrNotificationJob : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<DsrNotificationJob> _logger;

    // Colombia = UTC-5, siempre (no tiene horario de verano)
    private static readonly TimeSpan ColombiaOffset = TimeSpan.FromHours(-5);
    // 8 AM Colombia = 13:00 UTC
    private const int TargetHourUtc = 13;

    public DsrNotificationJob(
        IServiceScopeFactory scopeFactory,
        ILogger<DsrNotificationJob> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("🕐 DsrNotificationJob iniciado. Ejecutará a las 8:00 AM Colombia (13:00 UTC)");

        while (!stoppingToken.IsCancellationRequested)
        {
            var utcNow = DateTime.UtcNow;
            var nextRunUtc = GetNextRunUtc(utcNow);
            var delay = nextRunUtc - utcNow;

            if (delay < TimeSpan.Zero) delay = TimeSpan.FromSeconds(1);

            var colombiaTime = utcNow + ColombiaOffset;
            var nextRunColombia = nextRunUtc + ColombiaOffset;

            _logger.LogInformation(
                "⏰ Ahora: {Now} Colombia | Próxima ejecución: {NextRun} Colombia ({NextRunUtc} UTC) | Faltan: {Hours}h {Minutes}m",
                colombiaTime.ToString("yyyy-MM-dd HH:mm:ss"),
                nextRunColombia.ToString("yyyy-MM-dd HH:mm:ss"),
                nextRunUtc.ToString("yyyy-MM-dd HH:mm:ss"),
                (int)delay.TotalHours,
                delay.Minutes);

            try
            {
                await Task.Delay(delay, stoppingToken);
            }
            catch (TaskCanceledException)
            {
                break;
            }

            try
            {
                var ejecutadoColombia = DateTime.UtcNow + ColombiaOffset;
                _logger.LogInformation("🚀 Ejecutando revisión DSR - {Hora} Colombia ({HoraUtc} UTC)",
                    ejecutadoColombia.ToString("yyyy-MM-dd HH:mm:ss"),
                    DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"));

                using var scope = _scopeFactory.CreateScope();
                var notificationService = scope.ServiceProvider.GetRequiredService<IDsrNotificationService>();

                await notificationService.CheckDsrDeadlinesAndNotifyAsync(stoppingToken);
                await notificationService.RetryFailedNotificationsAsync(stoppingToken);

                _logger.LogInformation("✅ Job de las 8 AM Colombia completado exitosamente");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error ejecutando job de notificaciones DSR");
            }

            // Esperar 2 minutos para evitar doble ejecución
            try
            {
                await Task.Delay(TimeSpan.FromMinutes(2), stoppingToken);
            }
            catch (TaskCanceledException)
            {
                break;
            }
        }
    }

    /// <summary>
    /// Calcula la próxima ejecución: hoy o mañana a las 13:00 UTC (= 8:00 AM Colombia)
    /// </summary>
    private static DateTime GetNextRunUtc(DateTime utcNow)
    {
        var todayRun = utcNow.Date.AddHours(TargetHourUtc);

        if (utcNow >= todayRun)
        {
            // Ya pasó, programar para mañana
            return todayRun.AddDays(1);
        }

        return todayRun;
    }
}