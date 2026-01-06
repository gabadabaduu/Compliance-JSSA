using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.EPID.Interfaces;
using Compliance.Core.Modules.EPID.Dtos;

namespace Compliance.Infrastructure.Modules.EPID.Services
{
    public class EpidService : IEpidService
    {
        private readonly IEpidRepository _repo;
        public EpidService(IEpidRepository repo) => _repo = repo;

        public Task<IEnumerable<EpidNameDto>> GetAllNamesAsync(CancellationToken ct = default) =>
            _repo.GetNamesAsync(ct);

        public Task<EpidNameDto?> GetByIdAsync(long id, CancellationToken ct = default) =>
            _repo.GetByIdAsync(id, ct);
    }
}