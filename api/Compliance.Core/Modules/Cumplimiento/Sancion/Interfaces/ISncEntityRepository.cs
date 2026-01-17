using Compliance.Core.Modules.Cumplimiento.SncEntities.Dtos;

namespace Compliance.Core.Modules.Cumplimiento.SncEntities.Interfaces
{
    public interface ISncEntityRepository
    {
        Task<IEnumerable<SncEntityDto>> GetAllAsync(CancellationToken ct = default);
        Task<SncEntityDto?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<SncEntityDto> CreateAsync(CreateSncEntityDto dto, CancellationToken ct = default);
        Task<SncEntityDto> UpdateAsync(UpdateSncEntityDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
        Task<IEnumerable<SncEntityDto>> GetByIndustryAsync(int industryId, CancellationToken ct = default);
        Task<SncEntityDto?> GetByTaxIdAsync(string taxId, CancellationToken ct = default);
    }
}