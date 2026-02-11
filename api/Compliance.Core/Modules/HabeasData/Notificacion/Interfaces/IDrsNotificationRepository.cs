using Compliance.Core.Modules.HabeasData.Notificacion.Dtos;

namespace Compliance.Core.Modules.HabeasData.Notificacion.Interfaces;

public interface IDsrNotificationRepository
{
    Task<DsrNotificationDto?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<DsrNotificationDto>> GetByDsrIdAsync(int dsrId, CancellationToken ct = default);
    Task<IEnumerable<DsrNotificationDto>> GetByRecipientEmailAsync(string email, CancellationToken ct = default);
    Task<int> GetUnreadCountByEmailAsync(string email, CancellationToken ct = default);
    Task<bool> ExistsAsync(int dsrId, int daysBeforeDue, string recipientEmail, CancellationToken ct = default);
    Task<IEnumerable<DsrNotificationDto>> GetPendingAsync(CancellationToken ct = default);
    Task<DsrNotificationDto> CreateAsync(CreateDsrNotificationDto dto, CancellationToken ct = default);
    Task UpdateEmailSentAsync(int id, bool emailSent, CancellationToken ct = default);
    Task DeleteByDsrIdAsync(int dsrId, CancellationToken ct = default);
}