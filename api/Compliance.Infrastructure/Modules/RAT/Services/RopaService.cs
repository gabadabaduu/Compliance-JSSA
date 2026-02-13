using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.ROPA.Dtos;
using Compliance.Core.Modules.ROPA.Interfaces;

namespace Compliance.Infrastructure.Modules.ROPA.Services
{
    public class RopaService : IRopaService
    {
        private readonly IRopaRepository _repository;
        public RopaService(IRopaRepository repository) => _repository = repository;

        public Task<IEnumerable<RopaDto>> GetAllAsync(string? tenant = null, CancellationToken ct = default)
            => _repository.GetAllAsync(tenant, ct);

        public Task<RopaDto?> GetByIdAsync(int id, CancellationToken ct = default)
            => _repository.GetByIdAsync(id, ct);

        public Task<RopaDto> CreateAsync(CreateRopaDto dto, CancellationToken ct = default)
            => _repository.CreateAsync(dto, ct);

        public Task<RopaDto> UpdateAsync(UpdateRopaDto dto, CancellationToken ct = default)
            => _repository.UpdateAsync(dto, ct);

        public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
            => _repository.DeleteAsync(id, ct);
    }
}