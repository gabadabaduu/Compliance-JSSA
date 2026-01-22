using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.Sancion.Dtos;

namespace Compliance.Core.Modules.Cumplimiento.Sancion.Interfaces
{
    public interface ISancionService
    {
        Task<IEnumerable<SancionDto>> GetAllAsync(CancellationToken ct = default);
        Task<SancionDto?> GetByIdAsync(long id, CancellationToken ct = default);
        Task<SancionDto> CreateAsync(CreateSancionDto dto, CancellationToken ct = default);
        Task<SancionDto> UpdateAsync(UpdateSancionDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(long id, CancellationToken ct = default);

        // ✅ CAMBIADO: Reciben string
        Task<IEnumerable<SancionDto>> GetByStatusAsync(string status, CancellationToken ct = default);
        Task<IEnumerable<SancionDto>> GetByStageAsync(string stage, CancellationToken ct = default);
        Task<IEnumerable<SancionDto>> GetByEntityAsync(int entityId, CancellationToken ct = default);
        Task<IEnumerable<SancionDto>> GetFilteredAsync(
    int? entity,
    string? stage,
    int? initial,
    int? reconsideration,
    int? appeal,
    CancellationToken ct = default);
    }
}