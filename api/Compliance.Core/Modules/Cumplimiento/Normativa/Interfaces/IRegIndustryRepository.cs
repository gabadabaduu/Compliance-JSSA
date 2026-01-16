using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.RegIndustries.Dtos;

namespace Compliance.Core.Modules.Cumplimiento.RegIndustries.Interfaces
{
    public interface IRegIndustryRepository
    {
        Task<IEnumerable<RegIndustryDto>> GetAllAsync(CancellationToken ct = default);
        Task<RegIndustryDto?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<RegIndustryDto> CreateAsync(CreateRegIndustryDto dto, CancellationToken ct = default);
        Task<RegIndustryDto> UpdateAsync(UpdateRegIndustryDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}