using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.RegAuthorities.Dtos;

namespace Compliance.Core.Modules.Cumplimiento.RegAuthorities.Interfaces
{
    public interface IRegAuthorityRepository
    {
        Task<IEnumerable<RegAuthorityDto>> GetAllAsync(CancellationToken ct = default);
        Task<RegAuthorityDto?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<RegAuthorityDto> CreateAsync(CreateRegAuthorityDto dto, CancellationToken ct = default);
        Task<RegAuthorityDto> UpdateAsync(UpdateRegAuthorityDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}