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

        public Task<IEnumerable<SancionNameDto>> GetAllNamesAsync(CancellationToken ct = default) =>
            _repo.GetNamesAsync(ct);

        public Task<SancionNameDto?> GetByIdAsync(long id, CancellationToken ct = default) =>
            _repo.GetByIdAsync(id, ct);
    }
}