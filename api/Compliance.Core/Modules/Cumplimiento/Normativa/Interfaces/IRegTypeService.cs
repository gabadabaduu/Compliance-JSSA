using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.RegTypes.Dtos;

namespace Compliance.Core.Modules.Cumplimiento.RegTypes.Interfaces
{
    public interface IRegTypeService
    {
        Task<IEnumerable<RegTypeDto>> GetAllAsync(CancellationToken ct = default);
        Task<RegTypeDto?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<RegTypeDto> CreateAsync(CreateRegTypeDto dto, CancellationToken ct = default);
        Task<RegTypeDto> UpdateAsync(UpdateRegTypeDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}