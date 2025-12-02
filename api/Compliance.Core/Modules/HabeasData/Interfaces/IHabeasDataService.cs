using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.HabeasData.Dtos;

namespace Compliance.Core.Modules.HabeasData.Interfaces
{
    public interface IHabeasDataService
    {
        Task<IEnumerable<HabeasDataNameDto>> GetAllNamesAsync(CancellationToken ct = default);
        Task<HabeasDataNameDto?> GetByIdAsync(long id, CancellationToken ct = default);
    }
}