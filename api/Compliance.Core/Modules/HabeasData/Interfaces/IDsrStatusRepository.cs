using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.DSR.Dtos;

namespace Compliance.Core.Modules.DSR.Interfaces
{
    public interface IDsrStatusRepository
    {
        Task<IEnumerable<DsrStatusDto>> GetAllAsync(CancellationToken ct = default);
        Task<DsrStatusDto?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<DsrStatusDto> CreateAsync(CreateDsrStatusDto dto, CancellationToken ct = default);
        Task<DsrStatusDto> UpdateAsync(UpdateDsrStatusDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}