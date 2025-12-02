using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.MatrizRiesgo.Dtos;
using Compliance.Core.Modules.MatrizRiesgo.Interfaces;

namespace Compliance.Infrastructure.Modules.MatrizRiesgo.Services
{
    public class MatrizRiesgoService : IMatrizRiesgoService
    {
        private readonly IMatrizRiesgoRepository _repo;
        public MatrizRiesgoService(IMatrizRiesgoRepository repo) => _repo = repo;

        public Task<IEnumerable<MatrizRiesgoNameDto>> GetAllNamesAsync(CancellationToken ct = default) =>
            _repo.GetNamesAsync(ct);

        public Task<MatrizRiesgoNameDto?> GetByIdAsync(long id, CancellationToken ct = default) =>
            _repo.GetByIdAsync(id, ct);
    }
}