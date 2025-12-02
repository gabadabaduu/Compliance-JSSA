using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Ajustes.Dtos;

namespace Compliance.Core.Modules.Ajustes.Interfaces
{
    public interface IAjusteService
    {
        Task<IEnumerable<AjusteNameDto>> GetAllNamesAsync(CancellationToken ct = default);
        Task<AjusteNameDto?> GetByIdAsync(long id, CancellationToken ct = default);
    }
}