using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.ROPA.Dtos;
using Compliance.Core.Modules.ROPA.Interfaces;

namespace Compliance.Infrastructure.Modules.ROPA.Services
{
    public class RopaDataFlowService : IRopaDataFlowService
    {
        private readonly IRopaDataFlowRepository _repository;
        public RopaDataFlowService(IRopaDataFlowRepository repository) => _repository = repository;

        public Task<IEnumerable<RopaDataFlowDto>> GetAllAsync(CancellationToken ct = default)
            => _repository.GetAllAsync(ct);

        public Task<RopaDataFlowDto?> GetByIdAsync(int id, CancellationToken ct = default)
            => _repository.GetByIdAsync(id, ct);

        public Task<IEnumerable<RopaDataFlowDto>> GetByEntityIdAsync(int entityId, CancellationToken ct = default)
            => _repository.GetByEntityIdAsync(entityId, ct);

        public Task<IEnumerable<RopaDataFlowDto>> GetByProcessingActivityIdAsync(int activityId, CancellationToken ct = default)
            => _repository.GetByProcessingActivityIdAsync(activityId, ct);

        public Task<RopaDataFlowDto> CreateAsync(CreateRopaDataFlowDto dto, CancellationToken ct = default)
            => _repository.CreateAsync(dto, ct);

        public Task<RopaDataFlowDto> UpdateAsync(UpdateRopaDataFlowDto dto, CancellationToken ct = default)
            => _repository.UpdateAsync(dto, ct);

        public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
            => _repository.DeleteAsync(id, ct);
    }
}