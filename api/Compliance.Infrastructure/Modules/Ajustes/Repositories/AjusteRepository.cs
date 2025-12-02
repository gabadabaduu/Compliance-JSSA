using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Ajustes.Dtos;
using Compliance.Core.Modules.Ajustes.Interfaces;
using Compliance.Infrastructure.Data;
using Compliance.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Compliance.Infrastructure.Modules.Ajustes.Repositories
{
    public class AjusteRepository : IAjusteRepository
    {
        private readonly AppDbContext _db;
        public AjusteRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<AjusteNameDto>> GetNamesAsync(CancellationToken ct = default)
        {
            return await _db.Set<AjusteEntity>()
                .AsNoTracking()
                .OrderBy(e => e.Name)
                .Select(e => new AjusteNameDto { Id = e.Id, Nombre = e.Name ?? string.Empty })
                .ToListAsync(ct);
        }

        public async Task<AjusteNameDto?> GetByIdAsync(long id, CancellationToken ct = default)
        {
            return await _db.Set<AjusteEntity>()
                .AsNoTracking()
                .Where(e => e.Id == id)
                .Select(e => new AjusteNameDto { Id = e.Id, Nombre = e.Name ?? string.Empty })
                .FirstOrDefaultAsync(ct);
        }
    }
}