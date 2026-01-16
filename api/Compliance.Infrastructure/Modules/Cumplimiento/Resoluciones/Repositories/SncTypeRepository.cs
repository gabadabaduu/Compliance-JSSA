using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.SncType.Dtos;
using Compliance.Core.Modules.Cumplimiento.SncType.Interfaces;
using Compliance.Infrastructure.Data;
using Compliance.Infrastructure.Modules.Cumplimiento.SncType.Entities;
using Microsoft.EntityFrameworkCore;

namespace Compliance.Infrastructure.Modules.Cumplimiento.SncType.Repositories
{
    public class SncTypeRepository : ISncTypeRepository
    {
        private readonly AppDbContext _db;
        public SncTypeRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<SncTypeDto>> GetAllAsync(CancellationToken ct = default)
        {
            return await _db.Set<SncTypeEntity>()
                .AsNoTracking()
                .OrderBy(e => e.Name)
                .Select(e => new SncTypeDto { Id = e.Id, Name = e.Name })
                .ToListAsync(ct);
        }

        public async Task<SncTypeDto?> GetByIdAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<SncTypeEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            return entity != null ? new SncTypeDto { Id = entity.Id, Name = entity.Name } : null;
        }

        public async Task<SncTypeDto> CreateAsync(CreateSncTypeDto dto, CancellationToken ct = default)
        {
            var entity = new SncTypeEntity { Name = dto.Name };

            _db.Set<SncTypeEntity>().Add(entity);
            await _db.SaveChangesAsync(ct);

            return new SncTypeDto { Id = entity.Id, Name = entity.Name };
        }

        public async Task<SncTypeDto> UpdateAsync(UpdateSncTypeDto dto, CancellationToken ct = default)
        {
            var entity = await _db.Set<SncTypeEntity>()
                .FirstOrDefaultAsync(e => e.Id == dto.Id, ct);

            if (entity == null)
                throw new Exception($"SncType with ID {dto.Id} not found");

            if (dto.Name != null) entity.Name = dto.Name;

            await _db.SaveChangesAsync(ct);

            return new SncTypeDto { Id = entity.Id, Name = entity.Name };
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<SncTypeEntity>()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            if (entity == null) return false;

            _db.Set<SncTypeEntity>().Remove(entity);
            await _db.SaveChangesAsync(ct);

            return true;
        }
    }
}