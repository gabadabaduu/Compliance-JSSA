using Compliance.Core.Modules.Cumplimiento.SncResolutions.Dtos;

namespace Compliance.Core.Modules.Cumplimiento.SncResolutions.Interfaces
{
    public interface ISncResolutionRepository
    {
        Task<IEnumerable<SncResolutionDto>> GetAllAsync(CancellationToken ct = default);
        Task<SncResolutionDto?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<SncResolutionDto> CreateAsync(CreateSncResolutionDto dto, CancellationToken ct = default);
        Task<SncResolutionDto> UpdateAsync(UpdateSncResolutionDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
        Task<IEnumerable<SncResolutionDto>> GetBySanctionAsync(int sanctionId, CancellationToken ct = default);
        Task<IEnumerable<SncResolutionDto>> GetByYearAsync(int year, CancellationToken ct = default);
        Task<IEnumerable<SncResolutionDto>> GetByOutcomeAsync(string outcome, CancellationToken ct = default);
    }
}