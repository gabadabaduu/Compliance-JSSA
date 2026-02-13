using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.ROPA.Dtos;
using Compliance.Core.Modules.ROPA.Interfaces;

namespace Compliance.Infrastructure.Modules.ROPA.Services
{
    public class RopaDataTypeService : IRopaDataTypeService
    {
        private readonly IRopaDataTypeRepository _repository;
        public RopaDataTypeService(IRopaDataTypeRepository repository) => _repository = repository;

        public Task<IEnumerable<RopaDataTypeDto>> GetAllAsync(CancellationToken ct = default)
            => _repository.GetAllAsync(ct);

        public Task<RopaDataTypeDto?> GetByIdAsync(int id, CancellationToken ct = default)
            => _repository.GetByIdAsync(id, ct);

        public Task<RopaDataTypeDto> CreateAsync(CreateRopaDataTypeDto dto, CancellationToken ct = default)
            => _repository.CreateAsync(dto, ct);

        public Task<RopaDataTypeDto> UpdateAsync(UpdateRopaDataTypeDto dto, CancellationToken ct = default)
            => _repository.UpdateAsync(dto, ct);

        public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
            => _repository.DeleteAsync(id, ct);
    }
}