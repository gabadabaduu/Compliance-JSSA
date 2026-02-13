namespace Compliance.Core.Modules.HabeasData.Notificacion.Dtos;

public class DsrNotificationDto
{
    public int Id { get; set; }
    public int DsrId { get; set; }
    public string RecipientEmail { get; set; } = string.Empty;
    public string RecipientRole { get; set; } = string.Empty;
    public int DaysBeforeDue { get; set; }
    public bool EmailSent { get; set; }
    public DateTime CreatedAt { get; set; }

    // Datos del DSR relacionado
    public string? CaseId { get; set; }
    public string? FullName { get; set; }
    public string? RequestType { get; set; }
    public string? Status { get; set; }
    public DateTime? DueDate { get; set; }
    public string? Tenant { get; set; }
}

public class CreateDsrNotificationDto
{
    public int DsrId { get; set; }
    public string RecipientEmail { get; set; } = string.Empty;
    public string RecipientRole { get; set; } = string.Empty;
    public int DaysBeforeDue { get; set; }
    public bool EmailSent { get; set; } = false;
}