using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.Normativa.Dtos;

namespace Compliance.Core.Modules.Cumplimiento.Normativa.Interfaces
{
    public interface INormativaService
    {
        Task<IEnumerable<NormativaNameDto>> GetAllNamesAsync(CancellationToken ct = default);
        Task<NormativaNameDto?> GetByIdAsync(long id, CancellationToken ct = default);
    }
}