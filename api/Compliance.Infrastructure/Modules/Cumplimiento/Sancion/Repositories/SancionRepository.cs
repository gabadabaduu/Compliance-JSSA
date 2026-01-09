using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.Sancion.Dtos;
using Compliance.Core.Modules.Cumplimiento.Sancion.Interfaces;
using Compliance.Infrastructure.Data;
using Compliance.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Compliance.Infrastructure.Modules.Cumplimiento.Sancion.Repositories
{
    public class SancionRepository : ISancionRepository
    {
        private readonly AppDbContext _db;
        public SancionRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<SancionNameDto>> GetNamesAsync(CancellationToken ct = default)
        {
            return await _db.Set<SancionEntity>()
                .AsNoTracking()
                .OrderBy(e => e.Name)
                .Select(e => new SancionNameDto { Id = e.Id, Nombre = e.Name ?? string.Empty })
                .ToListAsync(ct);
        }

        public async Task<SancionNameDto?> GetByIdAsync(long id, CancellationToken ct = default)
        {
            return await _db.Set<SancionEntity>()
                .AsNoTracking()
                .Where(e => e.Id == id)
                .Select(e => new SancionNameDto { Id = e.Id, Nombre = e.Name ?? string.Empty })
                .FirstOrDefaultAsync(ct);
        }
    }
}