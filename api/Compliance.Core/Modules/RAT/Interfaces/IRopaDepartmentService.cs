using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.ROPA.Dtos;

namespace Compliance.Core.Modules.ROPA.Interfaces
{
    public interface IRopaDepartmentService
    {
        Task<IEnumerable<RopaDepartmentDto>> GetAllAsync(CancellationToken ct = default);
        Task<RopaDepartmentDto?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<RopaDepartmentDto> CreateAsync(CreateRopaDepartmentDto dto, CancellationToken ct = default);
        Task<RopaDepartmentDto> UpdateAsync(UpdateRopaDepartmentDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}