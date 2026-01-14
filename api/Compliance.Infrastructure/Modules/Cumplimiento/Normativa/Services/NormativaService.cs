using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.Normativa.Dtos;
using Compliance.Core.Modules.Cumplimiento.Normativa.Interfaces;

namespace Compliance.Infrastructure.Modules.Cumplimiento.Normativa.Services
{
    public class NormativaService : INormativaService
    {
        private readonly INormativaRepository _repo;
        public NormativaService(INormativaRepository repo) => _repo = repo;

        public Task<IEnumerable<NormativaDto>> GetAllAsync(CancellationToken ct = default) =>
            _repo.GetAllAsync(ct);

        public Task<NormativaDto?> GetByIdAsync(long id, CancellationToken ct = default) =>
            _repo.GetByIdAsync(id, ct);

        public Task<NormativaDto> CreateAsync(CreateNormativaDto dto, CancellationToken ct = default) =>
            _repo.CreateAsync(dto, ct);

        public Task<NormativaDto> UpdateAsync(UpdateNormativaDto dto, CancellationToken ct = default) =>
            _repo.UpdateAsync(dto, ct);

        public Task<bool> DeleteAsync(long id, CancellationToken ct = default) =>
            _repo.DeleteAsync(id, ct);

        public Task<IEnumerable<NormativaDto>> GetByStatusAsync(RegulationStatus status, CancellationToken ct = default) =>
            _repo.GetByStatusAsync(status, ct);

        public Task<IEnumerable<NormativaDto>> GetByYearAsync(int year, CancellationToken ct = default) =>
            _repo.GetByYearAsync(year, ct);
    }
}