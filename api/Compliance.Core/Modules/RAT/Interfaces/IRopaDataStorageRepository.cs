using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.ROPA.Dtos;

namespace Compliance.Core.Modules.ROPA.Interfaces
{
    public interface IRopaDataStorageRepository
    {
        Task<IEnumerable<RopaDataStorageDto>> GetAllAsync(string? tenant = null, CancellationToken ct = default); // ✅ ACTUALIZADO
        Task<RopaDataStorageDto?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<RopaDataStorageDto> CreateAsync(CreateRopaDataStorageDto dto, CancellationToken ct = default);
        Task<RopaDataStorageDto> UpdateAsync(UpdateRopaDataStorageDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
        Task<IEnumerable<string>> GetCountriesAsync(string? tenant = null, CancellationToken ct = default);
    }
}