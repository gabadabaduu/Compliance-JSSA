using Compliance.Core.Modules.Cumplimiento.SncType.Dtos;
using Compliance.Core.Modules.Cumplimiento.SncType.Interfaces;

namespace Compliance.Infrastructure.Modules.Cumplimiento.SncType.Services
{
    public class SncTypeService : ISncTypeService
    {
        private readonly ISncTypeRepository _repository;
        public SncTypeService(ISncTypeRepository repository) => _repository = repository;

        public Task<IEnumerable<SncTypeDto>> GetAllAsync(CancellationToken ct = default)
            => _repository.GetAllAsync(ct);

        public Task<SncTypeDto?> GetByIdAsync(int id, CancellationToken ct = default)
            => _repository.GetByIdAsync(id, ct);

        public Task<SncTypeDto> CreateAsync(CreateSncTypeDto dto, CancellationToken ct = default)
            => _repository.CreateAsync(dto, ct);

        public Task<SncTypeDto> UpdateAsync(UpdateSncTypeDto dto, CancellationToken ct = default)
            => _repository.UpdateAsync(dto, ct);

        public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
            => _repository.DeleteAsync(id, ct);
    }
}