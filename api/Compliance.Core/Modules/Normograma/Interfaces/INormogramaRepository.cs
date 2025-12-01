using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Normograma.Dtos;

namespace Compliance.Core.Modules.Normograma.Interfaces
{
    public interface INormogramaRepository
    {
        Task<IEnumerable<NormogramaNameDto>> GetNamesAsync(CancellationToken ct = default);
        Task<NormogramaNameDto?> GetByIdAsync(long id, CancellationToken ct = default);
    }
}