using Compliance.Core.Modules.Cumplimiento.SncResolutions.Dtos;
using Compliance.Core.Modules.Cumplimiento.SncResolutions.Interfaces;

namespace Compliance.Infrastructure.Modules.Cumplimiento.SncResolutions.Services
{
    public class SncResolutionService : ISncResolutionService
    {
        private readonly ISncResolutionRepository _repository;
        public SncResolutionService(ISncResolutionRepository repository) => _repository = repository;

        public Task<IEnumerable<SncResolutionDto>> GetAllAsync(CancellationToken ct = default)
            => _repository.GetAllAsync(ct);

        public Task<SncResolutionDto?> GetByIdAsync(int id, CancellationToken ct = default)
            => _repository.GetByIdAsync(id, ct);

        public Task<SncResolutionDto> CreateAsync(CreateSncResolutionDto dto, CancellationToken ct = default)
            => _repository.CreateAsync(dto, ct);

        public Task<SncResolutionDto> UpdateAsync(UpdateSncResolutionDto dto, CancellationToken ct = default)
            => _repository.UpdateAsync(dto, ct);

        public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
            => _repository.DeleteAsync(id, ct);

        // ✅ CORREGIDO: Parámetro string sanctions
        public Task<IEnumerable<SncResolutionDto>> GetBySanctionAsync(string sanctions, CancellationToken ct = default)
            => _repository.GetBySanctionAsync(sanctions, ct);

        public Task<IEnumerable<SncResolutionDto>> GetByYearAsync(int year, CancellationToken ct = default)
            => _repository.GetByYearAsync(year, ct);

        public Task<IEnumerable<SncResolutionDto>> GetByOutcomeAsync(string outcome, CancellationToken ct = default)
            => _repository.GetByOutcomeAsync(outcome, ct);
    }
}