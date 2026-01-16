using Compliance.Core.Modules.Cumplimiento.SncInfringements.Dtos;

namespace Compliance.Core.Modules.Cumplimiento.SncInfringements.Interfaces
{
    public interface ISncInfringementRepository
    {
        Task<IEnumerable<SncInfringementDto>> GetAllAsync(CancellationToken ct = default);
        Task<SncInfringementDto?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<SncInfringementDto> CreateAsync(CreateSncInfringementDto dto, CancellationToken ct = default);
        Task<SncInfringementDto> UpdateAsync(UpdateSncInfringementDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
        Task<IEnumerable<SncInfringementDto>> GetByStatuteAsync(int statuteId, CancellationToken ct = default);
    }
}