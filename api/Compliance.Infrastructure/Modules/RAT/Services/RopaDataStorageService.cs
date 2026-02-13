using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.ROPA.Dtos;
using Compliance.Core.Modules.ROPA.Interfaces;

namespace Compliance.Infrastructure.Modules.ROPA.Services
{
    public class RopaDataStorageService : IRopaDataStorageService
    {
        private readonly IRopaDataStorageRepository _repository;
        public RopaDataStorageService(IRopaDataStorageRepository repository) => _repository = repository;

        public Task<IEnumerable<RopaDataStorageDto>> GetAllAsync(string? tenant = null, CancellationToken ct = default) // ✅ ACTUALIZADO
            => _repository.GetAllAsync(tenant, ct);

        public Task<RopaDataStorageDto?> GetByIdAsync(int id, CancellationToken ct = default)
            => _repository.GetByIdAsync(id, ct);

        public Task<RopaDataStorageDto> CreateAsync(CreateRopaDataStorageDto dto, CancellationToken ct = default)
            => _repository.CreateAsync(dto, ct);

        public Task<RopaDataStorageDto> UpdateAsync(UpdateRopaDataStorageDto dto, CancellationToken ct = default)
            => _repository.UpdateAsync(dto, ct);

        public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
            => _repository.DeleteAsync(id, ct);
    }
}