using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Usuario.Dtos;
using Compliance.Core.Modules.Usuario.Interfaces;
using Compliance.Infrastructure.Data;
using Compliance.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Compliance.Infrastructure.Modules.Usuario.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly AppDbContext _db;
        public UsuarioRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<UsuarioNameDto>> GetNamesAsync(CancellationToken ct = default)
        {
            return await _db.Set<UsuarioEntity>()
                .AsNoTracking()
                .OrderBy(e => e.Name)
                .Select(e => new UsuarioNameDto { Id = e.Id, Nombre = e.Name ?? string.Empty })
                .ToListAsync(ct);
        }

        public async Task<UsuarioNameDto?> GetByIdAsync(long id, CancellationToken ct = default)
        {
            return await _db.Set<UsuarioEntity>()
                .AsNoTracking()
                .Where(e => e.Id == id)
                .Select(e => new UsuarioNameDto { Id = e.Id, Nombre = e.Name ?? string.Empty })
                .FirstOrDefaultAsync(ct);
        }
    }
}