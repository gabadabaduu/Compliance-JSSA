using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Usuario.Dtos;

namespace Compliance.Core.Modules.Usuario.Interfaces
{
    public interface IUsuarioService
    {
        Task<IEnumerable<UsuarioNameDto>> GetAllNamesAsync(CancellationToken ct = default);
        Task<UsuarioNameDto?> GetByIdAsync(long id, CancellationToken ct = default);
    }
}