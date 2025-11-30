using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.EPID.Dtos;
using Compliance.Core.Modules.EPID.Interfaces;
using Compliance.Infrastructure.Data;
using Compliance.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Compliance.Infrastructure.Modules.EPID.Repositories
{
    public class EpidRepository : IEpidRepository
    {
        private readonly AppDbContext _db;
        public EpidRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<EpidNameDto>> GetNamesAsync(CancellationToken ct = default)
        {
            return await _db.Set<EpidEntity>()
                .AsNoTracking()
                .OrderBy(e => e.Name)
                .Select(e => new EpidNameDto { Id = e.Id, Nombre = e.Name ?? string.Empty })
                .ToListAsync(ct);
        }

        public async Task<EpidNameDto?> GetByIdAsync(long id, CancellationToken ct = default)
        {
            return await _db.Set<EpidEntity>()
                .AsNoTracking()
                .Where(e => e.Id == id)
                .Select(e => new EpidNameDto { Id = e.Id, Nombre = e.Name ?? string.Empty })
                .FirstOrDefaultAsync(ct);
        }
    }
}