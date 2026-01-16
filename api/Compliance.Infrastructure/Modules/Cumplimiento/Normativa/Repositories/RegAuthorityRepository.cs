using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.RegAuthorities.Dtos;
using Compliance.Core.Modules.Cumplimiento.RegAuthorities.Interfaces;
using Compliance.Infrastructure.Data;
using Compliance.Infrastructure.Modules.Cumplimiento.RegAuthorities.Entities;
using Microsoft.EntityFrameworkCore;

namespace Compliance.Infrastructure.Modules.Cumplimiento.RegAuthorities.Repositories
{
    public class RegAuthorityRepository : IRegAuthorityRepository
    {
        private readonly AppDbContext _db;
        public RegAuthorityRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<RegAuthorityDto>> GetAllAsync(CancellationToken ct = default)
        {
            return await _db.Set<RegAuthorityEntity>()
                .AsNoTracking()
                .OrderBy(e => e.Name)
                .Select(e => new RegAuthorityDto { Id = e.Id, Name = e.Name })
                .ToListAsync(ct);
        }

        public async Task<RegAuthorityDto?> GetByIdAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<RegAuthorityEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            return entity != null ? new RegAuthorityDto { Id = entity.Id, Name = entity.Name } : null;
        }

        public async Task<RegAuthorityDto> CreateAsync(CreateRegAuthorityDto dto, CancellationToken ct = default)
        {
            var entity = new RegAuthorityEntity { Name = dto.Name };

            _db.Set<RegAuthorityEntity>().Add(entity);
            await _db.SaveChangesAsync(ct);

            return new RegAuthorityDto { Id = entity.Id, Name = entity.Name };
        }

        public async Task<RegAuthorityDto> UpdateAsync(UpdateRegAuthorityDto dto, CancellationToken ct = default)
        {
            var entity = await _db.Set<RegAuthorityEntity>()
                .FirstOrDefaultAsync(e => e.Id == dto.Id, ct);

            if (entity == null)
                throw new Exception($"RegAuthority with ID {dto.Id} not found");

            if (dto.Name != null) entity.Name = dto.Name;

            await _db.SaveChangesAsync(ct);

            return new RegAuthorityDto { Id = entity.Id, Name = entity.Name };
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<RegAuthorityEntity>()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            if (entity == null) return false;

            _db.Set<RegAuthorityEntity>().Remove(entity);
            await _db.SaveChangesAsync(ct);

            return true;
        }
    }
}