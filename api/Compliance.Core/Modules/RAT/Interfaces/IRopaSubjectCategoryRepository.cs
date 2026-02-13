using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.ROPA.Dtos;

namespace Compliance.Core.Modules.ROPA.Interfaces
{
    public interface IRopaSubjectCategoryRepository
    {
        Task<IEnumerable<RopaSubjectCategoryDto>> GetAllAsync(CancellationToken ct = default);
        Task<RopaSubjectCategoryDto?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<RopaSubjectCategoryDto> CreateAsync(CreateRopaSubjectCategoryDto dto, CancellationToken ct = default);
        Task<RopaSubjectCategoryDto> UpdateAsync(UpdateRopaSubjectCategoryDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}