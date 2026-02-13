using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.ROPA.Dtos;
using Compliance.Core.Modules.ROPA.Interfaces;

namespace Compliance.Infrastructure.Modules.ROPA.Services
{
    public class RopaEntityService : IRopaEntityService
    {
        private readonly IRopaEntityRepository _repository;
        public RopaEntityService(IRopaEntityRepository repository) => _repository = repository;

        public Task<IEnumerable<RopaEntityDto>> GetAllAsync(string? tenant = null, CancellationToken ct = default)
            => _repository.GetAllAsync(tenant, ct);

        public Task<RopaEntityDto?> GetByIdAsync(int id, CancellationToken ct = default)
            => _repository.GetByIdAsync(id, ct);

        public Task<RopaEntityDto> CreateAsync(CreateRopaEntityDto dto, CancellationToken ct = default)
            => _repository.CreateAsync(dto, ct);

        public Task<RopaEntityDto> UpdateAsync(UpdateRopaEntityDto dto, CancellationToken ct = default)
            => _repository.UpdateAsync(dto, ct);

        public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
            => _repository.DeleteAsync(id, ct);
    }
}