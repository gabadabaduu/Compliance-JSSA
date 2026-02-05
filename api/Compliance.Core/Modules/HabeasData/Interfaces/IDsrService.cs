using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.DSR.Dtos;

namespace Compliance.Core.Modules.DSR.Interfaces
{
    public interface IDsrService
    {
        Task<IEnumerable<DsrDto>> GetAllAsync(CancellationToken ct = default);
        Task<DsrDto?> GetByIdAsync(long id, CancellationToken ct = default);
        Task<IEnumerable<DsrDto>> GetByCompanyAsync(string companyName, CancellationToken ct = default);
        Task<DsrDto> CreateAsync(CreateDsrDto dto, CancellationToken ct = default);
        Task<DsrDto> UpdateAsync(UpdateDsrDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(long id, CancellationToken ct = default);
        Task<IEnumerable<DsrDto>> GetByCaseIdAsync(string caseId, CancellationToken ct = default);
        Task<IEnumerable<DsrDto>> GetByTypeAsync(int typeId, CancellationToken ct = default);
    }
}