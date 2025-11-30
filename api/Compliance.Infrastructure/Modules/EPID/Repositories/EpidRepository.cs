using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.EPID.Interfaces;
using Compliance.Infrastructure.Data;
using Compliance.Infrastructure.Entities;
using Compliance.Core.Modules.EPID.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Compliance.Infrastructure.Modules.EPID.Repositories
{
    public class EpidRepository : IEpidRepository
    {
        private readonly AppDbContext _db;
        public EpidRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<EpidNameDto>> GetNamesAsync(CancellationToken ct = default)
        {
            return await _db.Set<Epid>()
                .AsNoTracking()
                .OrderBy(e => e.Name)
                .Select(e => new EpidNameDto { Id = e.Id, Nombre = e.Name })
                .ToListAsync(ct);
        }

        public async Task<EpidNameDto?> GetByIdAsync(long id, CancellationToken ct = default)
        {
            return await _db.Set<Epid>()
                .AsNoTracking()
                .Where(e => e.Id == id)
                .Select(e => new EpidNameDto { Id = e.Id, Nombre = e.Name })
                .FirstOrDefaultAsync(ct);
        }
    }
}