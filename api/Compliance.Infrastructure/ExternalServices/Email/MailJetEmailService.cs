using System;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.HabeasData.Notificacion.Interfaces;
using Mailjet.Client;
using Mailjet.Client.Resources;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

namespace Compliance.Infrastructure.ExternalServices.Email;

public class MailjetEmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<MailjetEmailService> _logger;

    public MailjetEmailService(IConfiguration config, ILogger<MailjetEmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task<bool> SendEmailAsync(string toEmail, string toName, string subject, string htmlBody, CancellationToken ct = default)
    {
        try
        {
            var apiKey = _config["Mailjet:ApiKey"];
            var secretKey = _config["Mailjet:SecretKey"];
            var fromEmail = _config["Mailjet:FromEmail"];
            var fromName = _config["Mailjet:FromName"];

            if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(secretKey))
            {
                _logger.LogError("❌ Mailjet API Key o Secret Key no configuradas");
                return false;
            }

            var client = new MailjetClient(apiKey, secretKey);

            var request = new MailjetRequest
            {
                Resource = Send.Resource
            }
            .Property(Send.FromEmail, fromEmail)
            .Property(Send.FromName, fromName)
            .Property(Send.Subject, subject)
            .Property(Send.HtmlPart, htmlBody)
            .Property(Send.Recipients, new JArray
            {
                new JObject
                {
                    { "Email", toEmail },
                    { "Name", toName }
                }
            });

            var response = await client.PostAsync(request);

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("✅ Email enviado exitosamente a {Email}", toEmail);
                return true;
            }
            else
            {
                _logger.LogError("❌ Error enviando email a {Email}. Status: {Status}, Error: {Error}",
                    toEmail, response.StatusCode, response.GetErrorMessage());
                return false;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Excepción enviando email a {Email}", toEmail);
            return false;
        }
    }
}