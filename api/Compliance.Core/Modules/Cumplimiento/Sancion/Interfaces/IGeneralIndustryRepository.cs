using Compliance.Core.Modules.Cumplimiento.GeneralIndustries.Dtos;

namespace Compliance.Core.Modules.Cumplimiento.GeneralIndustries.Interfaces
{
    public interface IGeneralIndustryRepository
    {
        Task<IEnumerable<GeneralIndustryDto>> GetAllAsync(CancellationToken ct = default);
        Task<GeneralIndustryDto?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<GeneralIndustryDto> CreateAsync(CreateGeneralIndustryDto dto, CancellationToken ct = default);
        Task<GeneralIndustryDto> UpdateAsync(UpdateGeneralIndustryDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}