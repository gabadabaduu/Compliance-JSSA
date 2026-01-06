using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Usuario.Dtos;
using Compliance.Core.Modules.Usuario.Interfaces;

namespace Compliance.Infrastructure.Modules.Usuario.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _repo;
        public UsuarioService(IUsuarioRepository repo) => _repo = repo;

        public Task<IEnumerable<UsuarioNameDto>> GetAllNamesAsync(CancellationToken ct = default) =>
            _repo.GetNamesAsync(ct);

        public Task<UsuarioNameDto?> GetByIdAsync(long id, CancellationToken ct = default) =>
            _repo.GetByIdAsync(id, ct);
    }
}