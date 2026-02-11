using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.HabeasData.Notificacion.Dtos;
using Compliance.Core.Modules.HabeasData.Notificacion.Interfaces;
using Compliance.Infrastructure.Data;
using Compliance.Infrastructure.Modules.DSR.Entities;
using Compliance.Infrastructure.Modules.HabeasData.Notificacion.Entities;
using Compliance.Core.Modules.User.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Compliance.Infrastructure.Modules.HabeasData.Notificacion.Services;

public class DsrNotificationService : IDsrNotificationService
{
    private readonly AppDbContext _db;
    private readonly IDsrNotificationRepository _repository;
    private readonly IEmailService _emailService;
    private readonly IDsrNotificationHubService _hubService;
    private readonly ILogger<DsrNotificationService> _logger;

    public DsrNotificationService(
        AppDbContext db,
        IDsrNotificationRepository repository,
        IEmailService emailService,
        IDsrNotificationHubService hubService,
        ILogger<DsrNotificationService> logger)
    {
        _db = db;
        _repository = repository;
        _emailService = emailService;
        _hubService = hubService;
        _logger = logger;
    }

    // =====================================================
    // JOB COMPLETO - Revisa TODOS los DSRs (para las 8 AM)
    // =====================================================
    public async Task CheckDsrDeadlinesAndNotifyAsync(CancellationToken ct = default)
    {
        _logger.LogInformation("🔔 Iniciando revisión de vencimientos DSR...");

        await CleanAllClosedDsrNotificationsAsync(ct);

        var today = DateTime.UtcNow.Date;

        var openDsrs = await _db.Set<DsrEntity>()
            .AsNoTracking()
            .Where(d => d.Status == "Abierto")
            .ToListAsync(ct);

        _logger.LogInformation("📋 DSRs abiertos encontrados: {Count}", openDsrs.Count);

        var notifiedEmails = new HashSet<string>();

        foreach (var dsr in openDsrs)
        {
            var dueDate = dsr.DueDate.Date;
            var daysRemaining = (dueDate - today).Days;

            if (daysRemaining > 3) continue;

            _logger.LogInformation("⚠️ DSR {CaseId} - Días restantes: {Days}", dsr.CaseId, daysRemaining);

            var recipients = await GetRecipientsAsync(dsr, ct);

            foreach (var recipient in recipients)
            {
                var alreadyNotified = await _repository.ExistsAsync(
                    (int)dsr.Id, daysRemaining, recipient.Email, ct);

                if (alreadyNotified) continue;

                var htmlBody = BuildHtmlEmailBody(dsr, daysRemaining);
                var subject = $"Radicado No. {dsr.CaseId} - Solicitud Hábeas Data";

                var notificationDto = new CreateDsrNotificationDto
                {
                    DsrId = (int)dsr.Id,
                    RecipientEmail = recipient.Email,
                    RecipientRole = recipient.Role,
                    DaysBeforeDue = daysRemaining,
                    EmailSent = false
                };

                var notification = await _repository.CreateAsync(notificationDto, ct);

                var emailSent = await _emailService.SendEmailAsync(
                    recipient.Email, recipient.FullName, subject, htmlBody, ct);

                await _repository.UpdateEmailSentAsync(notification.Id, emailSent, ct);

                notifiedEmails.Add(recipient.Email);

                _logger.LogInformation("📧 Notificación {Status}: DSR {CaseId} -> {Email} ({Role}, días: {Days})",
                    emailSent ? "ENVIADA" : "FALLIDA",
                    dsr.CaseId, recipient.Email, recipient.Role, daysRemaining);
            }
        }

        if (notifiedEmails.Count > 0)
        {
            await _hubService.NotifyMultipleUsersAsync(notifiedEmails,
                "Tienes nuevas notificaciones de solicitudes Hábeas Data");
        }

        _logger.LogInformation("✅ Revisión de vencimientos DSR completada");
    }

    // =====================================================
    // VERIFICAR UN SOLO DSR (para crear/actualizar)
    // =====================================================
   public async Task CheckSingleDsrAndNotifyAsync(int dsrId, CancellationToken ct = default)
    {
        var dsr = await _db.Set<DsrEntity>()
            .AsNoTracking()
            .FirstOrDefaultAsync(d => (int)d.Id == dsrId, ct);

        if (dsr == null) return;

        // Si está cerrado, limpiar
        if (dsr.Status == "Cerrado")
        {
            await CleanDsrNotificationsAsync(dsrId, ct);
            return;
        }

        // Si no está abierto, no notificar
        if (dsr.Status != "Abierto") return;

        var today = DateTime.UtcNow.Date;
        var dueDate = dsr.DueDate.Date;
        var daysRemaining = (dueDate - today).Days;

        // SIEMPRE limpiar notificaciones anteriores de este DSR antes de re-evaluar
        var existingNotifications = await _repository.GetByDsrIdAsync(dsrId, ct);
        var previousEmails = existingNotifications.Select(n => n.RecipientEmail).Distinct().ToList();

        if (existingNotifications.Any())
        {
            await _repository.DeleteByDsrIdAsync(dsrId, ct);
            _logger.LogInformation("🗑️ Notificaciones anteriores eliminadas para DSR {DsrId} (re-evaluando)", dsrId);
        }

        // Si faltan más de 3 días, avisar que se limpiaron y salir
        if (daysRemaining > 3)
        {
            foreach (var email in previousEmails)
            {
                await _hubService.NotifyClearedAsync(email);
            }
            if (previousEmails.Any())
            {
                _logger.LogInformation("🗑️ DSR {DsrId} ya no está próximo a vencer, notificaciones eliminadas", dsrId);
            }
            return;
        }

        _logger.LogInformation("⚠️ DSR {CaseId} - Días restantes: {Days}", dsr.CaseId, daysRemaining);

        var recipients = await GetRecipientsAsync(dsr, ct);
        var notifiedEmails = new HashSet<string>();

        foreach (var recipient in recipients)
        {
            // Crear notificación nueva con los días actualizados
            var notificationDto = new CreateDsrNotificationDto
            {
                DsrId = dsrId,
                RecipientEmail = recipient.Email,
                RecipientRole = recipient.Role,
                DaysBeforeDue = daysRemaining,
                EmailSent = false
            };

            await _repository.CreateAsync(notificationDto, ct);
            notifiedEmails.Add(recipient.Email);

            _logger.LogInformation("🔔 Notificación creada: DSR {CaseId} -> {Email} (días: {Days})",
                dsr.CaseId, recipient.Email, daysRemaining);
        }

        // Avisar por WebSocket
        if (notifiedEmails.Count > 0)
        {
            await _hubService.NotifyMultipleUsersAsync(notifiedEmails,
                $"Solicitud {dsr.CaseId} requiere atención ({daysRemaining} días restantes)");
        }
        // También avisar a los que tenían notificaciones antes pero ya no
        foreach (var email in previousEmails.Where(e => !notifiedEmails.Contains(e)))
        {
            await _hubService.NotifyClearedAsync(email);
        }
    }
    // =====================================================
    // LIMPIAR NOTIFICACIONES DE UN DSR ESPECÍFICO
    // =====================================================
    public async Task CleanDsrNotificationsAsync(int dsrId, CancellationToken ct = default)
    {
        var notifications = await _repository.GetByDsrIdAsync(dsrId, ct);
        var affectedEmails = notifications.Select(n => n.RecipientEmail).Distinct().ToList();

        if (!affectedEmails.Any()) return;

        await _repository.DeleteByDsrIdAsync(dsrId, ct);
        _logger.LogInformation("🗑️ Notificaciones eliminadas para DSR {DsrId}", dsrId);

        foreach (var email in affectedEmails)
        {
            await _hubService.NotifyClearedAsync(email);
        }
    }

    // =====================================================
    // LIMPIAR TODOS LOS DSRs CERRADOS
    // =====================================================
    private async Task CleanAllClosedDsrNotificationsAsync(CancellationToken ct)
    {
        var affectedData = await (
            from n in _db.Set<DsrNotificationEntity>()
            join d in _db.Set<DsrEntity>() on n.DsrId equals (int)d.Id
            where d.Status == "Cerrado"
            select new { n.DsrId, n.RecipientEmail }
        ).ToListAsync(ct);

        var affectedEmails = affectedData.Select(x => x.RecipientEmail).Distinct().ToList();
        var closedDsrIds = affectedData.Select(x => x.DsrId).Distinct().ToList();

        foreach (var dsrId in closedDsrIds)
        {
            await _repository.DeleteByDsrIdAsync(dsrId, ct);
            _logger.LogInformation("🗑️ Notificaciones eliminadas para DSR cerrado: {DsrId}", dsrId);
        }

        foreach (var email in affectedEmails)
        {
            await _hubService.NotifyClearedAsync(email);
        }

        if (closedDsrIds.Count > 0)
        {
            _logger.LogInformation("🧹 Se limpiaron notificaciones de {Count} DSR(s) cerrado(s)",
                closedDsrIds.Count);
        }
    }

    // =====================================================
    // REINTENTAR ENVÍOS FALLIDOS
    // =====================================================
    public async Task RetryFailedNotificationsAsync(CancellationToken ct = default)
    {
        _logger.LogInformation("🔄 Reintentando notificaciones fallidas...");

        var pending = await _repository.GetPendingAsync(ct);

        foreach (var notification in pending)
        {
            var dsr = await _db.Set<DsrEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(d => (int)d.Id == notification.DsrId, ct);

            if (dsr == null) continue;

            var htmlBody = BuildHtmlEmailBody(dsr, notification.DaysBeforeDue);
            var subject = $"Radicado No. {dsr.CaseId} - Solicitud Hábeas Data";

            var emailSent = await _emailService.SendEmailAsync(
                notification.RecipientEmail,
                notification.FullName ?? notification.RecipientEmail,
                subject, htmlBody, ct);

            await _repository.UpdateEmailSentAsync(notification.Id, emailSent, ct);

            _logger.LogInformation("🔄 Reintento {Status}: Notification {Id} -> {Email}",
                emailSent ? "EXITOSO" : "FALLIDO",
                notification.Id, notification.RecipientEmail);
        }
    }

    // =====================================================
    // CONSULTAS
    // =====================================================
    public async Task<List<DsrNotificationDto>> GetNotificationsByDsrIdAsync(int dsrId, CancellationToken ct = default)
    {
        var notifications = await _repository.GetByDsrIdAsync(dsrId, ct);
        return notifications.ToList();
    }

    public async Task<bool> HasBeenNotifiedAsync(int dsrId, int daysBeforeDue, string recipientEmail, CancellationToken ct = default)
    {
        return await _repository.ExistsAsync(dsrId, daysBeforeDue, recipientEmail, ct);
    }

    public async Task<List<DsrNotificationDto>> GetNotificationsByEmailAsync(string email, CancellationToken ct = default)
    {
        var notifications = await _repository.GetByRecipientEmailAsync(email, ct);
        return notifications.ToList();
    }

    public async Task<int> GetUnreadCountAsync(string email, CancellationToken ct = default)
    {
        return await _repository.GetUnreadCountByEmailAsync(email, ct);
    }

    // =====================================================
    // MÉTODOS PRIVADOS
    // =====================================================
    private async Task<List<RecipientInfo>> GetRecipientsAsync(DsrEntity dsr, CancellationToken ct)
    {
        var recipients = new List<RecipientInfo>();

        if (!string.IsNullOrEmpty(dsr.CreatedBy))
        {
            var creatorId = Guid.Parse(dsr.CreatedBy);
            var creator = await _db.Set<AppUser>()
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == creatorId, ct);

            if (creator != null && !string.IsNullOrEmpty(creator.Email))
            {
                recipients.Add(new RecipientInfo
                {
                    Email = creator.Email,
                    FullName = creator.FullName ?? creator.Email,
                    Role = "user"
                });
            }
        }

        if (!string.IsNullOrEmpty(dsr.Tenant))
        {
            var admin = await _db.Set<AppUser>()
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.NombreEmpresa == dsr.Tenant
                    && u.Role == "admin", ct);

            if (admin != null && !string.IsNullOrEmpty(admin.Email))
            {
                if (!recipients.Any(r => r.Email == admin.Email))
                {
                    recipients.Add(new RecipientInfo
                    {
                        Email = admin.Email,
                        FullName = admin.FullName ?? admin.Email,
                        Role = "admin"
                    });
                }
            }
        }

        return recipients;
    }

    private string BuildHtmlEmailBody(DsrEntity dsr, int daysRemaining)
    {
        var requestType = _db.Set<DsrRequestTypeEntity>()
            .AsNoTracking()
            .FirstOrDefault(rt => rt.Id == dsr.Type);

        var typeName = requestType?.Type ?? "No especificado";

        var urgencyColor = daysRemaining switch
        {
            > 1 => "#f59e0b",
            1 => "#f97316",
            0 => "#ef4444",
            _ => "#dc2626"
        };

        var urgencyText = daysRemaining switch
        {
            > 0 => $"Quedan <strong>{daysRemaining} día(s) hábiles</strong> para dar respuesta.",
            0 => "⚠️ <strong>La solicitud VENCE HOY.</strong>",
            _ => $"🚨 <strong>La solicitud está VENCIDA hace {Math.Abs(daysRemaining)} día(s).</strong>"
        };

        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""utf-8"">
</head>
<body style=""font-family: Arial, sans-serif; background-color: #f4f6fb; margin: 0; padding: 20px;"">
    <div style=""max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);"">
        
        <div style=""background-color: #1e293b; padding: 24px; text-align: center;"">
            <h1 style=""color: #ffffff; margin: 0; font-size: 20px;"">Solicitud Hábeas Data</h1>
        </div>

        <div style=""background-color: {urgencyColor}; padding: 12px 24px; text-align: center;"">
            <p style=""color: #ffffff; margin: 0; font-size: 14px;"">{urgencyText}</p>
        </div>

        <div style=""padding: 24px;"">
            <p style=""color: #374151; font-size: 15px; line-height: 1.6;"">
                Estimado(a) usuario,
            </p>
            <p style=""color: #374151; font-size: 15px; line-height: 1.6;"">
                Le informamos que se ha registrado una solicitud para el ejercicio de derechos de 
                <strong>{typeName}</strong> sobre datos personales del titular 
                <strong>{dsr.FullName}</strong>, la cual ha sido registrada con la siguiente información:
            </p>

            <table style=""width: 100%; border-collapse: collapse; margin: 20px 0;"">
                <tr>
                    <td style=""padding: 10px 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-weight: bold; color: #475569; width: 40%;"">Número de radicado</td>
                    <td style=""padding: 10px 12px; border: 1px solid #e2e8f0; color: #1e293b;"">{dsr.CaseId}</td>
                </tr>
                <tr>
                    <td style=""padding: 10px 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-weight: bold; color: #475569;"">Tipo de solicitud</td>
                    <td style=""padding: 10px 12px; border: 1px solid #e2e8f0; color: #1e293b;"">{typeName}</td>
                </tr>
                <tr>
                    <td style=""padding: 10px 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-weight: bold; color: #475569;"">Titular</td>
                    <td style=""padding: 10px 12px; border: 1px solid #e2e8f0; color: #1e293b;"">{dsr.FullName}</td>
                </tr>
                <tr>
                    <td style=""padding: 10px 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-weight: bold; color: #475569;"">Fecha límite de respuesta</td>
                    <td style=""padding: 10px 12px; border: 1px solid #e2e8f0; color: {urgencyColor}; font-weight: bold;"">{dsr.DueDate:dd/MM/yyyy}</td>
                </tr>
            </table>

            <p style=""color: #6b7280; font-size: 13px; line-height: 1.6;"">
                Por favor, gestione esta solicitud dentro del plazo establecido para dar cumplimiento 
                a la normativa de protección de datos personales.
            </p>
        </div>

        <div style=""background-color: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; text-align: center;"">
            <p style=""color: #6b7280; font-size: 12px; margin: 0;"">
                Atentamente, <strong>{dsr.Tenant}</strong>
            </p>
            <p style=""color: #9ca3af; font-size: 11px; margin: 8px 0 0 0;"">
                Este es un mensaje automático generado por el sistema de Compliance.
            </p>
        </div>
    </div>
</body>
</html>";
    }

    private class RecipientInfo
    {
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}