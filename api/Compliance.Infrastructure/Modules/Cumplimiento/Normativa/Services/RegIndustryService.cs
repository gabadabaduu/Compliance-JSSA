using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.RegIndustries.Dtos;
using Compliance.Core.Modules.Cumplimiento.RegIndustries.Interfaces;

namespace Compliance.Infrastructure.Modules.Cumplimiento.RegIndustries.Services
{
    public class RegIndustryService : IRegIndustryService
    {
        private readonly IRegIndustryRepository _repository;
        public RegIndustryService(IRegIndustryRepository repository) => _repository = repository;

        public Task<IEnumerable<RegIndustryDto>> GetAllAsync(CancellationToken ct = default)
            => _repository.GetAllAsync(ct);

        public Task<RegIndustryDto?> GetByIdAsync(int id, CancellationToken ct = default)
            => _repository.GetByIdAsync(id, ct);

        public Task<RegIndustryDto> CreateAsync(CreateRegIndustryDto dto, CancellationToken ct = default)
            => _repository.CreateAsync(dto, ct);

        public Task<RegIndustryDto> UpdateAsync(UpdateRegIndustryDto dto, CancellationToken ct = default)
            => _repository.UpdateAsync(dto, ct);

        public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
            => _repository.DeleteAsync(id, ct);
    }
}