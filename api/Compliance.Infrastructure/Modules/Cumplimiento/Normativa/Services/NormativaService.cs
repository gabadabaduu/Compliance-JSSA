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

        public Task<IEnumerable<NormativaNameDto>> GetAllNamesAsync(CancellationToken ct = default) =>
            _repo.GetNamesAsync(ct);

        public Task<NormativaNameDto?> GetByIdAsync(long id, CancellationToken ct = default) =>
            _repo.GetByIdAsync(id, ct);
    }
}