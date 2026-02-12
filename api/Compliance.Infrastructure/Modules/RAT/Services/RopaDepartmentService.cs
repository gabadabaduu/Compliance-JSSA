using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.ROPA.Dtos;
using Compliance.Core.Modules.ROPA.Interfaces;

namespace Compliance.Infrastructure.Modules.ROPA.Services
{
    public class RopaDepartmentService : IRopaDepartmentService
    {
        private readonly IRopaDepartmentRepository _repository;
        public RopaDepartmentService(IRopaDepartmentRepository repository) => _repository = repository;

        public Task<IEnumerable<RopaDepartmentDto>> GetAllAsync(CancellationToken ct = default)
            => _repository.GetAllAsync(ct);

        public Task<RopaDepartmentDto?> GetByIdAsync(int id, CancellationToken ct = default)
            => _repository.GetByIdAsync(id, ct);

        public Task<RopaDepartmentDto> CreateAsync(CreateRopaDepartmentDto dto, CancellationToken ct = default)
            => _repository.CreateAsync(dto, ct);

        public Task<RopaDepartmentDto> UpdateAsync(UpdateRopaDepartmentDto dto, CancellationToken ct = default)
            => _repository.UpdateAsync(dto, ct);

        public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
            => _repository.DeleteAsync(id, ct);
    }
}