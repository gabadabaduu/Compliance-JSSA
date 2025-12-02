using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.MatrizRiesgo.Dtos;

namespace Compliance.Core.Modules.MatrizRiesgo.Interfaces
{
    public interface IMatrizRiesgoRepository
    {
        Task<IEnumerable<MatrizRiesgoNameDto>> GetNamesAsync(CancellationToken ct = default);
        Task<MatrizRiesgoNameDto?> GetByIdAsync(long id, CancellationToken ct = default);
    }
}