using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.ROPA.Dtos;

namespace Compliance.Core.Modules.ROPA.Interfaces
{
    public interface IRopaDataFlowRepository
    {
        Task<IEnumerable<RopaDataFlowDto>> GetAllAsync(CancellationToken ct = default);
        Task<RopaDataFlowDto?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<IEnumerable<RopaDataFlowDto>> GetByEntityIdAsync(int entityId, CancellationToken ct = default);
        Task<IEnumerable<RopaDataFlowDto>> GetByProcessingActivityIdAsync(int activityId, CancellationToken ct = default);
        Task<RopaDataFlowDto> CreateAsync(CreateRopaDataFlowDto dto, CancellationToken ct = default);
        Task<RopaDataFlowDto> UpdateAsync(UpdateRopaDataFlowDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}