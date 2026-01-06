using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.RAT.Dtos;
using Compliance.Core.Modules.RAT.Interfaces;

namespace Compliance.Infrastructure.Modules.RAT.Services
{
    public class RatService : IRatService
    {
        private readonly IRatRepository _repo;
        public RatService(IRatRepository repo) => _repo = repo;

        public Task<IEnumerable<RatNameDto>> GetAllNamesAsync(CancellationToken ct = default) =>
            _repo.GetNamesAsync(ct);

        public Task<RatNameDto?> GetByIdAsync(long id, CancellationToken ct = default) =>
            _repo.GetByIdAsync(id, ct);
    }
}