using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.DSR.Dtos;

namespace Compliance.Core.Modules.DSR.Interfaces
{
    public interface IDsrRequestTypeRepository
    {
        Task<IEnumerable<DsrRequestTypeDto>> GetAllAsync(CancellationToken ct = default);
        Task<DsrRequestTypeDto?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<DsrRequestTypeDto> CreateAsync(CreateDsrRequestTypeDto dto, CancellationToken ct = default);
        Task<DsrRequestTypeDto> UpdateAsync(UpdateDsrRequestTypeDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}