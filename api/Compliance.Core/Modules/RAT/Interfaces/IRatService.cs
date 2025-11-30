using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.RAT.Dtos;

namespace Compliance.Core.Modules.RAT.Interfaces
{
    public interface IRatService
    {
        Task<IEnumerable<RatNameDto>> GetAllNamesAsync(CancellationToken ct = default);
        Task<RatNameDto?> GetByIdAsync(long id, CancellationToken ct = default);
    }
}