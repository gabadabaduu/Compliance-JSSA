using Compliance.Core.Modules.Cumplimiento.SncEntities.Dtos;
using Compliance.Core.Modules.Cumplimiento.SncEntities.Interfaces;

namespace Compliance.Infrastructure.Modules.Cumplimiento.SncEntities.Services
{
    public class SncEntityService : ISncEntityService
    {
        private readonly ISncEntityRepository _repository;
        public SncEntityService(ISncEntityRepository repository) => _repository = repository;

        public Task<IEnumerable<SncEntityDto>> GetAllAsync(CancellationToken ct = default)
            => _repository.GetAllAsync(ct);

        public Task<SncEntityDto?> GetByIdAsync(int id, CancellationToken ct = default)
            => _repository.GetByIdAsync(id, ct);

        public Task<SncEntityDto> CreateAsync(CreateSncEntityDto dto, CancellationToken ct = default)
            => _repository.CreateAsync(dto, ct);

        public Task<SncEntityDto> UpdateAsync(UpdateSncEntityDto dto, CancellationToken ct = default)
            => _repository.UpdateAsync(dto, ct);

        public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
            => _repository.DeleteAsync(id, ct);

        public Task<IEnumerable<SncEntityDto>> GetByIndustryAsync(int industryId, CancellationToken ct = default)
            => _repository.GetByIndustryAsync(industryId, ct);

        public Task<SncEntityDto?> GetByTaxIdAsync(string taxId, CancellationToken ct = default)
            => _repository.GetByTaxIdAsync(taxId, ct);
    }
}