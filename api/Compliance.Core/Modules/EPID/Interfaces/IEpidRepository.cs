using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.EPID.Dtos;

namespace Compliance.Core.Modules.EPID.Interfaces
{
    public interface IEpidRepository
    {
        Task<IEnumerable<EpidNameDto>> GetNamesAsync(CancellationToken ct = default);
        Task<EpidNameDto?> GetByIdAsync(long id, CancellationToken ct = default);
    }
}