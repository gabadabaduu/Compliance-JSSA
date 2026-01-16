using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.RegDomains.Dtos;
using Compliance.Core.Modules.Cumplimiento.RegDomains.Interfaces;
using Compliance.Infrastructure.Data;
using Compliance.Infrastructure.Modules.Cumplimiento.RegDomains.Entities;
using Microsoft.EntityFrameworkCore;

namespace Compliance.Infrastructure.Modules.Cumplimiento.RegDomains.Repositories
{
    public class RegDomainRepository : IRegDomainRepository
    {
        private readonly AppDbContext _db;
        public RegDomainRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<RegDomainDto>> GetAllAsync(CancellationToken ct = default)
        {
            return await _db.Set<RegDomainEntity>()
                .AsNoTracking()
                .OrderBy(e => e.Name)
                .Select(e => new RegDomainDto { Id = e.Id, Name = e.Name })
                .ToListAsync(ct);
        }

        public async Task<RegDomainDto?> GetByIdAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<RegDomainEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            return entity != null ? new RegDomainDto { Id = entity.Id, Name = entity.Name } : null;
        }

        public async Task<RegDomainDto> CreateAsync(CreateRegDomainDto dto, CancellationToken ct = default)
        {
            var entity = new RegDomainEntity { Name = dto.Name };

            _db.Set<RegDomainEntity>().Add(entity);
            await _db.SaveChangesAsync(ct);

            return new RegDomainDto { Id = entity.Id, Name = entity.Name };
        }

        public async Task<RegDomainDto> UpdateAsync(UpdateRegDomainDto dto, CancellationToken ct = default)
        {
            var entity = await _db.Set<RegDomainEntity>()
                .FirstOrDefaultAsync(e => e.Id == dto.Id, ct);

            if (entity == null)
                throw new Exception($"RegDomain with ID {dto.Id} not found");

            if (dto.Name != null) entity.Name = dto.Name;

            await _db.SaveChangesAsync(ct);

            return new RegDomainDto { Id = entity.Id, Name = entity.Name };
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<RegDomainEntity>()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            if (entity == null) return false;

            _db.Set<RegDomainEntity>().Remove(entity);
            await _db.SaveChangesAsync(ct);

            return true;
        }
    }
}