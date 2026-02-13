using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.DSR.Dtos;
using Compliance.Core.Modules.DSR.Interfaces;
using Compliance.Core.Modules.HabeasData.Notificacion.Interfaces;
using Microsoft.Extensions.Logging;

namespace Compliance.Infrastructure.Modules.DSR.Services
{
    public class DsrService : IDsrService
    {
        private readonly IDsrRepository _repository;
        private readonly IDsrNotificationService _notificationService;
        private readonly IDsrNotificationHubService _hubService;
        private readonly ILogger<DsrService> _logger;

        public DsrService(
            IDsrRepository repository,
            IDsrNotificationService notificationService,
            IDsrNotificationHubService hubService,
            ILogger<DsrService> logger)
        {
            _repository = repository;
            _notificationService = notificationService;
            _hubService = hubService;
            _logger = logger;
        }

        public Task<IEnumerable<DsrDto>> GetAllAsync(CancellationToken ct = default)
            => _repository.GetAllAsync(ct);

        public Task<IEnumerable<DsrDto>> GetByCompanyAsync(string companyName, CancellationToken ct = default)
            => _repository.GetByCompanyAsync(companyName, ct);

        public Task<IEnumerable<DsrDto>> GetFilteredAsync(DsrFilterDto filters, CancellationToken ct = default)
            => _repository.GetFilteredAsync(filters, ct);

        public Task<DsrDto?> GetByIdAsync(long id, CancellationToken ct = default)
            => _repository.GetByIdAsync(id, ct);

        // =====================================================
        // CREATE: Verificar si necesita notificación al crear
        // =====================================================
        public async Task<DsrDto> CreateAsync(CreateDsrDto dto, CancellationToken ct = default)
        {
            var result = await _repository.CreateAsync(dto, ct);

            // Verificar si el DSR recién creado necesita notificación
            await _notificationService.CheckSingleDsrAndNotifyAsync((int)result.Id, ct);
            _logger.LogInformation("🔔 Verificación de notificación tras crear DSR {CaseId}", result.CaseId);

            return result;
        }

        // =====================================================
        // UPDATE: Cubrir todos los escenarios de cambio
        // =====================================================
        public async Task<DsrDto> UpdateAsync(UpdateDsrDto dto, CancellationToken ct = default)
        {
            var result = await _repository.UpdateAsync(dto, ct);

            if (dto.Status != null && dto.Status.Equals("Cerrado", StringComparison.OrdinalIgnoreCase))
            {
                // CERRAR: Limpiar notificaciones + avisar WebSocket
                await _notificationService.CleanDsrNotificationsAsync((int)dto.Id, ct);
                _logger.LogInformation("🗑️ Notificaciones eliminadas al cerrar DSR {DsrId}", dto.Id);
            }
            else
            {
                // CUALQUIER OTRO CAMBIO: Re-verificar notificaciones
                // Esto cubre: cambio de due_date, cambio de status a Abierto, etc.
                await _notificationService.CheckSingleDsrAndNotifyAsync((int)dto.Id, ct);
                _logger.LogInformation("🔔 Re-verificación de notificación tras actualizar DSR {DsrId}", dto.Id);
            }

            // Avisar a la empresa que hubo un cambio
            if (!string.IsNullOrEmpty(result.Tenant))
            {
                await _hubService.NotifyCompanyAsync(result.Tenant,
                    $"La solicitud {result.CaseId} ha sido actualizada");
            }

            return result;
        }

        // =====================================================
        // DELETE: Limpiar notificaciones huérfanas
        // =====================================================
        public async Task<bool> DeleteAsync(long id, CancellationToken ct = default)
        {
            // Limpiar notificaciones ANTES de borrar el DSR
            await _notificationService.CleanDsrNotificationsAsync((int)id, ct);
            _logger.LogInformation("🗑️ Notificaciones eliminadas antes de borrar DSR {DsrId}", id);

            var result = await _repository.DeleteAsync(id, ct);
            return result;
        }

        public Task<IEnumerable<DsrDto>> GetByCaseIdAsync(string caseId, CancellationToken ct = default)
            => _repository.GetByCaseIdAsync(caseId, ct);

        public Task<IEnumerable<DsrDto>> GetByTypeAsync(int typeId, CancellationToken ct = default)
            => _repository.GetByTypeAsync(typeId, ct);
    }
}