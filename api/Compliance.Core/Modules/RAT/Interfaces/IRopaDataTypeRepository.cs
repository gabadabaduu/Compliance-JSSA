using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.ROPA.Dtos;

namespace Compliance.Core.Modules.ROPA.Interfaces
{
    public interface IRopaDataTypeRepository
    {
        Task<IEnumerable<RopaDataTypeDto>> GetAllAsync(CancellationToken ct = default);
        Task<RopaDataTypeDto?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<RopaDataTypeDto> CreateAsync(CreateRopaDataTypeDto dto, CancellationToken ct = default);
        Task<RopaDataTypeDto> UpdateAsync(UpdateRopaDataTypeDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}