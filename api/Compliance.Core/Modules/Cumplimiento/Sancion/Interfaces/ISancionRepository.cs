using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.Sancion.Dtos;

namespace Compliance.Core.Modules.Cumplimiento.Sancion.Interfaces
{
    public interface ISancionRepository
    {
        Task<IEnumerable<SancionDto>> GetAllAsync(CancellationToken ct = default);
        Task<SancionDto?> GetByIdAsync(long id, CancellationToken ct = default);
        Task<SancionDto> CreateAsync(CreateSancionDto dto, CancellationToken ct = default);
        Task<SancionDto> UpdateAsync(UpdateSancionDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(long id, CancellationToken ct = default);
        Task<IEnumerable<SancionDto>> GetByStatusAsync(SanctionStatus status, CancellationToken ct = default);
        Task<IEnumerable<SancionDto>> GetByStageAsync(SanctionStage stage, CancellationToken ct = default);
        Task<IEnumerable<SancionDto>> GetByEntityAsync(int entityId, CancellationToken ct = default);
    }
}