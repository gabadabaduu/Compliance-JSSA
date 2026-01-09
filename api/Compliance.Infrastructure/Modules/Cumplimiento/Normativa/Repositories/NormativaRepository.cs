using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.Normativa.Dtos;
using Compliance.Core.Modules.Cumplimiento.Normativa.Interfaces;
using Compliance.Infrastructure.Data;
using Compliance.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Compliance.Infrastructure.Modules.Cumplimiento.Normativa.Repositories
{
    public class NormativaRepository : INormativaRepository
    {
        private readonly AppDbContext _db;
        public NormativaRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<NormativaNameDto>> GetNamesAsync(CancellationToken ct = default)
        {
            return await _db.Set<NormativaEntity>()
                .AsNoTracking()
                .OrderBy(e => e.Name)
                .Select(e => new NormativaNameDto { Id = e.Id, Nombre = e.Name ?? string.Empty })
                .ToListAsync(ct);
        }

        public async Task<NormativaNameDto?> GetByIdAsync(long id, CancellationToken ct = default)
        {
            return await _db.Set<NormativaEntity>()
                .AsNoTracking()
                .Where(e => e.Id == id)
                .Select(e => new NormativaNameDto { Id = e.Id, Nombre = e.Name ?? string.Empty })
                .FirstOrDefaultAsync(ct);
        }
    }
}