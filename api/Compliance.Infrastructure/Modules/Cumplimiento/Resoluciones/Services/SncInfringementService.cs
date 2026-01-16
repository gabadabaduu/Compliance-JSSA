using Compliance.Core.Modules.Cumplimiento.SncInfringements.Dtos;
using Compliance.Core.Modules.Cumplimiento.SncInfringements.Interfaces;

namespace Compliance.Infrastructure.Modules.Cumplimiento.SncInfringements.Services
{
    public class SncInfringementService : ISncInfringementService
    {
        private readonly ISncInfringementRepository _repository;
        public SncInfringementService(ISncInfringementRepository repository) => _repository = repository;

        public Task<IEnumerable<SncInfringementDto>> GetAllAsync(CancellationToken ct = default)
            => _repository.GetAllAsync(ct);

        public Task<SncInfringementDto?> GetByIdAsync(int id, CancellationToken ct = default)
            => _repository.GetByIdAsync(id, ct);

        public Task<SncInfringementDto> CreateAsync(CreateSncInfringementDto dto, CancellationToken ct = default)
            => _repository.CreateAsync(dto, ct);

        public Task<SncInfringementDto> UpdateAsync(UpdateSncInfringementDto dto, CancellationToken ct = default)
            => _repository.UpdateAsync(dto, ct);

        public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
            => _repository.DeleteAsync(id, ct);

        public Task<IEnumerable<SncInfringementDto>> GetByStatuteAsync(int statuteId, CancellationToken ct = default)
            => _repository.GetByStatuteAsync(statuteId, ct);
    }
}