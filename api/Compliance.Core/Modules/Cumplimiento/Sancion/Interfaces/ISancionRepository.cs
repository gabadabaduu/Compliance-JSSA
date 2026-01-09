using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.Sancion.Dtos;

namespace Compliance.Core.Modules.Cumplimiento.Sancion.Interfaces
{
    public interface ISancionRepository
    {
        Task<IEnumerable<SancionNameDto>> GetNamesAsync(CancellationToken ct = default);
        Task<SancionNameDto?> GetByIdAsync(long id, CancellationToken ct = default);
    }
}