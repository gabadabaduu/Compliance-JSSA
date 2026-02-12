using Compliance.Core.Modules.HabeasData.Notificacion.Dtos;

namespace Compliance.Core.Modules.HabeasData.Notificacion.Interfaces;

public interface IDsrNotificationService
{
    Task CheckDsrDeadlinesAndNotifyAsync(CancellationToken ct = default);
    Task CheckSingleDsrAndNotifyAsync(int dsrId, CancellationToken ct = default);
    Task CleanDsrNotificationsAsync(int dsrId, CancellationToken ct = default);
    Task RetryFailedNotificationsAsync(CancellationToken ct = default);
    Task<List<DsrNotificationDto>> GetNotificationsByDsrIdAsync(int dsrId, CancellationToken ct = default);
    Task<bool> HasBeenNotifiedAsync(int dsrId, int daysBeforeDue, string recipientEmail, CancellationToken ct = default);
    Task<List<DsrNotificationDto>> GetNotificationsByEmailAsync(string email, CancellationToken ct = default);
    Task<int> GetUnreadCountAsync(string email, CancellationToken ct = default);
}