using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.ROPA.Dtos;

namespace Compliance.Core.Modules.ROPA.Interfaces
{
    public interface IRopaRepository
    {
        Task<IEnumerable<RopaDto>> GetAllAsync(string? tenant = null, CancellationToken ct = default);
        Task<RopaDto?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<RopaDto> CreateAsync(CreateRopaDto dto, CancellationToken ct = default);
        Task<RopaDto> UpdateAsync(UpdateRopaDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}