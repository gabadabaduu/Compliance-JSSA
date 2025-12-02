using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Ajustes.Dtos;
using Compliance.Core.Modules.Ajustes.Interfaces;

namespace Compliance.Infrastructure.Modules.Ajustes.Services
{
    public class AjusteService : IAjusteService
    {
        private readonly IAjusteRepository _repo;
        public AjusteService(IAjusteRepository repo) => _repo = repo;

        public Task<IEnumerable<AjusteNameDto>> GetAllNamesAsync(CancellationToken ct = default) =>
            _repo.GetNamesAsync(ct);

        public Task<AjusteNameDto?> GetByIdAsync(long id, CancellationToken ct = default) =>
            _repo.GetByIdAsync(id, ct);
    }
}