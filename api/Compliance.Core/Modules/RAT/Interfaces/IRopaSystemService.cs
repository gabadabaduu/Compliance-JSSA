using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.ROPA.Dtos;

namespace Compliance.Core.Modules.ROPA.Interfaces
{
    public interface IRopaSystemService
    {
        Task<IEnumerable<RopaSystemDto>> GetAllAsync(CancellationToken ct = default);
        Task<RopaSystemDto?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<RopaSystemDto> CreateAsync(CreateRopaSystemDto dto, CancellationToken ct = default);
        Task<RopaSystemDto> UpdateAsync(UpdateRopaSystemDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}