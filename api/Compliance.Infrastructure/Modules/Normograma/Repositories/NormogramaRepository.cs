using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Normograma.Dtos;
using Compliance.Core.Modules.Normograma.Interfaces;
using Compliance.Infrastructure.Data;
using Compliance.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Compliance.Infrastructure.Modules.Normograma.Repositories
{
    public class NormogramaRepository : INormogramaRepository
    {
        private readonly AppDbContext _db;
        public NormogramaRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<NormogramaNameDto>> GetNamesAsync(CancellationToken ct = default)
        {
            return await _db.Set<NormogramaEntity>()
                .AsNoTracking()
                .OrderBy(e => e.Name)
                .Select(e => new NormogramaNameDto { Id = e.Id, Nombre = e.Name ?? string.Empty })
                .ToListAsync(ct);
        }

        public async Task<NormogramaNameDto?> GetByIdAsync(long id, CancellationToken ct = default)
        {
            return await _db.Set<NormogramaEntity>()
                .AsNoTracking()
                .Where(e => e.Id == id)
                .Select(e => new NormogramaNameDto { Id = e.Id, Nombre = e.Name ?? string.Empty })
                .FirstOrDefaultAsync(ct);
        }
    }
}