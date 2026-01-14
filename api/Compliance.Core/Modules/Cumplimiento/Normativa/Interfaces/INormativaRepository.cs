using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.Normativa.Dtos;

namespace Compliance.Core.Modules.Cumplimiento.Normativa.Interfaces
{
    public interface INormativaRepository
    {
        Task<IEnumerable<NormativaDto>> GetAllAsync(CancellationToken ct = default);
        Task<NormativaDto?> GetByIdAsync(long id, CancellationToken ct = default);
        Task<NormativaDto> CreateAsync(CreateNormativaDto dto, CancellationToken ct = default);
        Task<NormativaDto> UpdateAsync(UpdateNormativaDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(long id, CancellationToken ct = default);
        Task<IEnumerable<NormativaDto>> GetByStatusAsync(RegulationStatus status, CancellationToken ct = default);
        Task<IEnumerable<NormativaDto>> GetByYearAsync(int year, CancellationToken ct = default);
    }
}