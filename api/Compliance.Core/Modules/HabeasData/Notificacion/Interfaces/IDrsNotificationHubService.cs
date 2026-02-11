namespace Compliance.Core.Modules.HabeasData.Notificacion.Interfaces;

public interface IDsrNotificationHubService
{
    /// <summary>
    /// Notificar a un usuario específico por email que tiene nuevas notificaciones
    /// </summary>
    Task NotifyUserAsync(string email, string message);

    /// <summary>
    /// Notificar a todos los usuarios de una empresa que hubo cambios en DSR
    /// </summary>
    Task NotifyCompanyAsync(string companyName, string message);

    /// <summary>
    /// Notificar a usuarios específicos que sus notificaciones fueron eliminadas (DSR cerrado)
    /// </summary>
    Task NotifyClearedAsync(string email);

    /// <summary>
    /// Notificar a varios emails a la vez
    /// </summary>
    Task NotifyMultipleUsersAsync(IEnumerable<string> emails, string message);
}