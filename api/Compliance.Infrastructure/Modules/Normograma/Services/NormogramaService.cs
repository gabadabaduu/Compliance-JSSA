using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Normograma.Dtos;
using Compliance.Core.Modules.Normograma.Interfaces;

namespace Compliance.Infrastructure.Modules.Normograma.Services
{
    public class NormogramaService : INormogramaService
    {
        private readonly INormogramaRepository _repo;
        public NormogramaService(INormogramaRepository repo) => _repo = repo;

        public Task<IEnumerable<NormogramaNameDto>> GetAllNamesAsync(CancellationToken ct = default) =>
            _repo.GetNamesAsync(ct);

        public Task<NormogramaNameDto?> GetByIdAsync(long id, CancellationToken ct = default) =>
            _repo.GetByIdAsync(id, ct);
    }
}