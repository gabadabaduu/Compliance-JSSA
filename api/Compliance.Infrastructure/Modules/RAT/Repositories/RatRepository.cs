using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.RAT.Dtos;
using Compliance.Core.Modules.RAT.Interfaces;
using Compliance.Infrastructure.Data;
using Compliance.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Compliance.Infrastructure.Modules.RAT.Repositories
{
    public class RatRepository : IRatRepository
    {
        private readonly AppDbContext _db;
        public RatRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<RatNameDto>> GetNamesAsync(CancellationToken ct = default)
        {
            return await _db.Set<RatEntity>()
                .AsNoTracking()
                .OrderBy(e => e.Name)
                .Select(e => new RatNameDto { Id = e.Id, Nombre = e.Name ?? string.Empty })
                .ToListAsync(ct);
        }

        public async Task<RatNameDto?> GetByIdAsync(long id, CancellationToken ct = default)
        {
            return await _db.Set<RatEntity>()
                .AsNoTracking()
                .Where(e => e.Id == id)
                .Select(e => new RatNameDto { Id = e.Id, Nombre = e.Name ?? string.Empty })
                .FirstOrDefaultAsync(ct);
        }
    }
}