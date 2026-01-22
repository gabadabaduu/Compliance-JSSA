using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.Sancion.Dtos;
using Compliance.Core.Modules.Cumplimiento.Sancion.Interfaces;

namespace Compliance.Infrastructure.Modules.Cumplimiento.Sancion.Services
{
    public class SancionService : ISancionService
    {
        private readonly ISancionRepository _repo;
        public SancionService(ISancionRepository repo) => _repo = repo;

        public Task<IEnumerable<SancionDto>> GetAllAsync(CancellationToken ct = default) =>
            _repo.GetAllAsync(ct);

        public Task<SancionDto?> GetByIdAsync(long id, CancellationToken ct = default) =>
            _repo.GetByIdAsync(id, ct);

        public Task<SancionDto> CreateAsync(CreateSancionDto dto, CancellationToken ct = default) =>
            _repo.CreateAsync(dto, ct);

        public Task<SancionDto> UpdateAsync(UpdateSancionDto dto, CancellationToken ct = default) =>
            _repo.UpdateAsync(dto, ct);

        public Task<bool> DeleteAsync(long id, CancellationToken ct = default) =>
            _repo.DeleteAsync(id, ct);

        public Task<IEnumerable<SancionDto>> GetByStatusAsync(string status, CancellationToken ct = default) =>
            _repo.GetByStatusAsync(status, ct);

        public Task<IEnumerable<SancionDto>> GetByStageAsync(string stage, CancellationToken ct = default) =>
            _repo.GetByStageAsync(stage, ct);

        public Task<IEnumerable<SancionDto>> GetByEntityAsync(int entityId, CancellationToken ct = default) =>
            _repo.GetByEntityAsync(entityId, ct);

        public Task<IEnumerable<SancionDto>> GetFilteredAsync(
    int? entity,
    string? stage,
    int? initial,
    int? reconsideration,
    int? appeal,
    CancellationToken ct = default)
        {
            return _repo.GetFilteredAsync(entity, stage, initial, reconsideration, appeal, ct);
        }
    }
}