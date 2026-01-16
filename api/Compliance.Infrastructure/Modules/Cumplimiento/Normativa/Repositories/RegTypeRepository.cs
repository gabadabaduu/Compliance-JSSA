using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.RegTypes.Dtos;
using Compliance.Core.Modules.Cumplimiento.RegTypes.Interfaces;
using Compliance.Infrastructure.Data;
using Compliance.Infrastructure.Modules.Cumplimiento.RegTypes.Entities;
using Microsoft.EntityFrameworkCore;

namespace Compliance.Infrastructure.Modules.Cumplimiento.RegTypes.Repositories
{
    public class RegTypeRepository : IRegTypeRepository
    {
        private readonly AppDbContext _db;
        public RegTypeRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<RegTypeDto>> GetAllAsync(CancellationToken ct = default)
        {
            return await _db.Set<RegTypeEntity>()
                .AsNoTracking()
                .OrderBy(e => e.Type)
                .Select(e => new RegTypeDto { Id = e.Id, Type = e.Type })
                .ToListAsync(ct);
        }

        public async Task<RegTypeDto?> GetByIdAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<RegTypeEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            return entity != null ? new RegTypeDto { Id = entity.Id, Type = entity.Type } : null;
        }

        public async Task<RegTypeDto> CreateAsync(CreateRegTypeDto dto, CancellationToken ct = default)
        {
            var entity = new RegTypeEntity { Type = dto.Type };

            _db.Set<RegTypeEntity>().Add(entity);
            await _db.SaveChangesAsync(ct);

            return new RegTypeDto { Id = entity.Id, Type = entity.Type };
        }

        public async Task<RegTypeDto> UpdateAsync(UpdateRegTypeDto dto, CancellationToken ct = default)
        {
            var entity = await _db.Set<RegTypeEntity>()
                .FirstOrDefaultAsync(e => e.Id == dto.Id, ct);

            if (entity == null)
                throw new Exception($"RegType with ID {dto.Id} not found");

            if (dto.Type != null) entity.Type = dto.Type;

            await _db.SaveChangesAsync(ct);

            return new RegTypeDto { Id = entity.Id, Type = entity.Type };
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<RegTypeEntity>()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            if (entity == null) return false;

            _db.Set<RegTypeEntity>().Remove(entity);
            await _db.SaveChangesAsync(ct);

            return true;
        }
    }

}