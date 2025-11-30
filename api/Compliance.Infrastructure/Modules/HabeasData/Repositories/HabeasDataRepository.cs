using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.HabeasData.Dtos;
using Compliance.Core.Modules.HabeasData.Interfaces;
using Compliance.Infrastructure.Data;
using Compliance.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;


namespace Compliance.Infrastructure.Modules.HabeasData.Repositories
{
    public class HabeasDataRepository : IHabeasDataRepository
    {
        private readonly AppDbContext _db;
        public HabeasDataRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<HabeasDataNameDto>> GetNamesAsync(CancellationToken ct = default)
        {
            return await _db.Set<HabeasDataEntity>()
                .AsNoTracking()
                .OrderBy(e => e.Name)
                .Select(e => new HabeasDataNameDto { Id = e.Id, Nombre = e.Name ?? string.Empty })
                .ToListAsync(ct);
        }

        public async Task<HabeasDataNameDto?> GetByIdAsync(long id, CancellationToken ct = default)
        {
            return await _db.Set<HabeasDataEntity>()
                .AsNoTracking()
                .Where(e => e.Id == id)
                .Select(e => new HabeasDataNameDto { Id = e.Id, Nombre = e.Name ?? string.Empty })
                .FirstOrDefaultAsync(ct);
        }
    }
}