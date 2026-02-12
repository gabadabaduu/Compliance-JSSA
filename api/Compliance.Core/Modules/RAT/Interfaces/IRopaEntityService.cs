using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.ROPA.Dtos;

namespace Compliance.Core.Modules.ROPA.Interfaces
{
    public interface IRopaEntityService
    {
        Task<IEnumerable<RopaEntityDto>> GetAllAsync(CancellationToken ct = default);
        Task<RopaEntityDto?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<RopaEntityDto> CreateAsync(CreateRopaEntityDto dto, CancellationToken ct = default);
        Task<RopaEntityDto> UpdateAsync(UpdateRopaEntityDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}