using Compliance.Core.Modules.Cumplimiento.SncResolutions.Dtos;

namespace Compliance.Core.Modules.Cumplimiento.SncResolutions.Interfaces
{
    public interface ISncResolutionService
    {
        Task<IEnumerable<SncResolutionDto>> GetAllAsync(CancellationToken ct = default);
        Task<SncResolutionDto?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<SncResolutionDto> CreateAsync(CreateSncResolutionDto dto, CancellationToken ct = default);
        Task<SncResolutionDto> UpdateAsync(UpdateSncResolutionDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
        Task<IEnumerable<SncResolutionDto>> GetBySanctionAsync(string sanctions, CancellationToken ct = default);  // ✅ STRING
        Task<IEnumerable<SncResolutionDto>> GetByYearAsync(int year, CancellationToken ct = default);
        Task<IEnumerable<SncResolutionDto>> GetByOutcomeAsync(string outcome, CancellationToken ct = default);
        Task<IEnumerable<SncResolutionDto>> GetFilteredAsync(
    string? sanctions,
    string? issueDate,
    int? year,
    string? resolutionType,
    int? infringements,
    int? sanctionType,
    string? outcome,
    CancellationToken ct = default);
    }
}