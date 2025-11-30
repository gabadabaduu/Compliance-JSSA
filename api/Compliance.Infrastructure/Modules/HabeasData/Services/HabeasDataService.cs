using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.HabeasData.Dtos;
using Compliance.Core.Modules.HabeasData.Interfaces;

namespace Compliance.Infrastructure.Modules.HabeasData.Services
{
    public class HabeasDataService : IHabeasDataService
    {
        private readonly IHabeasDataRepository _repo;
        public HabeasDataService(IHabeasDataRepository repo) => _repo = repo;

        public Task<IEnumerable<HabeasDataNameDto>> GetAllNamesAsync(CancellationToken ct = default) =>
            _repo.GetNamesAsync(ct);

        public Task<HabeasDataNameDto?> GetByIdAsync(long id, CancellationToken ct = default) =>
            _repo.GetByIdAsync(id, ct);
    }
}