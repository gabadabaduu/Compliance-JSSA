namespace Compliance.Core.Modules.HabeasData.Notificacion.Interfaces;

public interface IEmailService
{
    Task<bool> SendEmailAsync(string toEmail, string toName, string subject, string htmlBody, CancellationToken ct = default);
}