using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.ROPA.Dtos;

namespace Compliance.Core.Modules.ROPA.Interfaces
{
    public interface IRopaContractRepository
    {
        Task<IEnumerable<RopaContractDto>> GetAllAsync(string? tenant = null, CancellationToken ct = default); // ✅ ACTUALIZADO
        Task<RopaContractDto?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<IEnumerable<RopaContractDto>> GetByEntityIdAsync(int entityId, string? tenant = null, CancellationToken ct = default); // ✅ ACTUALIZADO
        Task<RopaContractDto> CreateAsync(CreateRopaContractDto dto, CancellationToken ct = default);
        Task<RopaContractDto> UpdateAsync(UpdateRopaContractDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}