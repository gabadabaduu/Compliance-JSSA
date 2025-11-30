using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.HabeasData.Dtos;

namespace Compliance.Core.Modules.HabeasData.Interfaces
{
    public interface IHabeasDataRepository
    {
        Task<IEnumerable<HabeasDataNameDto>> GetNamesAsync(CancellationToken ct = default);
        Task<HabeasDataNameDto?> GetByIdAsync(long id, CancellationToken ct = default);
    }
}