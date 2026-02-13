using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.ROPA.Dtos;
using Compliance.Core.Modules.ROPA.Interfaces;

namespace Compliance.Infrastructure.Modules.ROPA.Services
{
    public class RopaContractService : IRopaContractService
    {
        private readonly IRopaContractRepository _repository;
        public RopaContractService(IRopaContractRepository repository) => _repository = repository;

        public Task<IEnumerable<RopaContractDto>> GetAllAsync(string? tenant = null, CancellationToken ct = default)
            => _repository.GetAllAsync(tenant, ct);

        public Task<RopaContractDto?> GetByIdAsync(int id, CancellationToken ct = default)
            => _repository.GetByIdAsync(id, ct);

        public Task<IEnumerable<RopaContractDto>> GetByEntityIdAsync(int entityId, string? tenant = null, CancellationToken ct = default)
            => _repository.GetByEntityIdAsync(entityId, tenant, ct);

        public Task<RopaContractDto> CreateAsync(CreateRopaContractDto dto, CancellationToken ct = default)
            => _repository.CreateAsync(dto, ct);

        public Task<RopaContractDto> UpdateAsync(UpdateRopaContractDto dto, CancellationToken ct = default)
            => _repository.UpdateAsync(dto, ct);

        public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
            => _repository.DeleteAsync(id, ct);
    }
}