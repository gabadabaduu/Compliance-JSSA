namespace Compliance.Infrastructure.Modules.HabeasData.Notificacion.Entities;

public class DsrNotificationEntity
{
    public int Id { get; set; }
    public int DsrId { get; set; }
    public string RecipientEmail { get; set; } = string.Empty;
    public string RecipientRole { get; set; } = string.Empty;
    public int DaysBeforeDue { get; set; }
    public bool EmailSent { get; set; } = false;
    public DateTime CreatedAt { get; set; }
}