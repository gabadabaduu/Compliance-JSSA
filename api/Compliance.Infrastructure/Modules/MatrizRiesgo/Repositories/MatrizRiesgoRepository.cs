using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.MatrizRiesgo.Dtos;
using Compliance.Core.Modules.MatrizRiesgo.Interfaces;
using Compliance.Infrastructure.Data;
using Compliance.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Compliance.Infrastructure.Modules.MatrizRiesgo.Repositories
{
	public class MatrizRiesgoRepository : IMatrizRiesgoRepository
	{
		private readonly AppDbContext _db;
		public MatrizRiesgoRepository(AppDbContext db) => _db = db;

		public async Task<IEnumerable<MatrizRiesgoNameDto>> GetNamesAsync(CancellationToken ct = default)
		{
			return await _db.Set<MatrizRiesgoEntity>()
				.AsNoTracking()
				.OrderBy(e => e.Name)
				.Select(e => new MatrizRiesgoNameDto { Id = e.Id, Nombre = e.Name ?? string.Empty })
				.ToListAsync(ct);
		}

		public async Task<MatrizRiesgoNameDto?> GetByIdAsync(long id, CancellationToken ct = default)
		{
			return await _db.Set<MatrizRiesgoEntity>()
				.AsNoTracking()
				.Where(e => e.Id == id)
				.Select(e => new MatrizRiesgoNameDto { Id = e.Id, Nombre = e.Name ?? string.Empty })
				.FirstOrDefaultAsync(ct);
		}
	}
}