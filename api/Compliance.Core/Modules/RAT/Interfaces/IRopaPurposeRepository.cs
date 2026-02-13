using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.ROPA.Dtos;

namespace Compliance.Core.Modules.ROPA.Interfaces
{
    public interface IRopaPurposeRepository
    {
        Task<IEnumerable<RopaPurposeDto>> GetAllAsync(CancellationToken ct = default);
        Task<RopaPurposeDto?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<RopaPurposeDto> CreateAsync(CreateRopaPurposeDto dto, CancellationToken ct = default);
        Task<RopaPurposeDto> UpdateAsync(UpdateRopaPurposeDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}