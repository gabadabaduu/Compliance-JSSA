using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Normograma.Dtos;

namespace Compliance.Core.Modules.Normograma.Interfaces
{
    public interface INormogramaService
    {
        Task<IEnumerable<NormogramaNameDto>> GetAllNamesAsync(CancellationToken ct = default);
        Task<NormogramaNameDto?> GetByIdAsync(long id, CancellationToken ct = default);
    }
}