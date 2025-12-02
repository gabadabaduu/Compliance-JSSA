using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Usuario.Dtos;

namespace Compliance.Core.Modules.Usuario.Interfaces
{
    public interface IUsuarioRepository
    {
        Task<IEnumerable<UsuarioNameDto>> GetNamesAsync(CancellationToken ct = default);
        Task<UsuarioNameDto?> GetByIdAsync(long id, CancellationToken ct = default);
    }
}