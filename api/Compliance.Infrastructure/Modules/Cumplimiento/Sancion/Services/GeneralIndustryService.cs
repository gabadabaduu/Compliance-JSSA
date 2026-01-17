using Compliance.Core.Modules.Cumplimiento.GeneralIndustries.Dtos;
using Compliance.Core.Modules.Cumplimiento.GeneralIndustries.Interfaces;

namespace Compliance.Infrastructure.Modules.Cumplimiento.GeneralIndustries.Services
{
    public class GeneralIndustryService : IGeneralIndustryService
    {
        private readonly IGeneralIndustryRepository _repository;
        public GeneralIndustryService(IGeneralIndustryRepository repository) => _repository = repository;

        public Task<IEnumerable<GeneralIndustryDto>> GetAllAsync(CancellationToken ct = default)
            => _repository.GetAllAsync(ct);

        public Task<GeneralIndustryDto?> GetByIdAsync(int id, CancellationToken ct = default)
            => _repository.GetByIdAsync(id, ct);

        public Task<GeneralIndustryDto> CreateAsync(CreateGeneralIndustryDto dto, CancellationToken ct = default)
            => _repository.CreateAsync(dto, ct);

        public Task<GeneralIndustryDto> UpdateAsync(UpdateGeneralIndustryDto dto, CancellationToken ct = default)
            => _repository.UpdateAsync(dto, ct);

        public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
            => _repository.DeleteAsync(id, ct);
    }
}