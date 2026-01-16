using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.RegDomains.Dtos;

namespace Compliance.Core.Modules.Cumplimiento.RegDomains.Interfaces
{
    public interface IRegDomainRepository
    {
        Task<IEnumerable<RegDomainDto>> GetAllAsync(CancellationToken ct = default);
        Task<RegDomainDto?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<RegDomainDto> CreateAsync(CreateRegDomainDto dto, CancellationToken ct = default);
        Task<RegDomainDto> UpdateAsync(UpdateRegDomainDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}