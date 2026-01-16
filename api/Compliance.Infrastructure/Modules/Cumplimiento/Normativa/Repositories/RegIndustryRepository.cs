using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.RegIndustries.Dtos;
using Compliance.Core.Modules.Cumplimiento.RegIndustries.Interfaces;
using Compliance.Infrastructure.Data;
using Compliance.Infrastructure.Modules.Cumplimiento.RegIndustries.Entities;
using Microsoft.EntityFrameworkCore;

namespace Compliance.Infrastructure.Modules.Cumplimiento.RegIndustries.Repositories
{
    public class RegIndustryRepository : IRegIndustryRepository
    {
        private readonly AppDbContext _db;
        public RegIndustryRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<RegIndustryDto>> GetAllAsync(CancellationToken ct = default)
        {
            return await _db.Set<RegIndustryEntity>()
                .AsNoTracking()
                .OrderBy(e => e.Name)
                .Select(e => new RegIndustryDto { Id = e.Id, Name = e.Name })
                .ToListAsync(ct);
        }

        public async Task<RegIndustryDto?> GetByIdAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<RegIndustryEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            return entity != null ? new RegIndustryDto { Id = entity.Id, Name = entity.Name } : null;
        }

        public async Task<RegIndustryDto> CreateAsync(CreateRegIndustryDto dto, CancellationToken ct = default)
        {
            var entity = new RegIndustryEntity { Name = dto.Name };

            _db.Set<RegIndustryEntity>().Add(entity);
            await _db.SaveChangesAsync(ct);

            return new RegIndustryDto { Id = entity.Id, Name = entity.Name };
        }

        public async Task<RegIndustryDto> UpdateAsync(UpdateRegIndustryDto dto, CancellationToken ct = default)
        {
            var entity = await _db.Set<RegIndustryEntity>()
                .FirstOrDefaultAsync(e => e.Id == dto.Id, ct);

            if (entity == null)
                throw new Exception($"RegIndustry with ID {dto.Id} not found");

            if (dto.Name != null) entity.Name = dto.Name;

            await _db.SaveChangesAsync(ct);

            return new RegIndustryDto { Id = entity.Id, Name = entity.Name };
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<RegIndustryEntity>()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            if (entity == null) return false;

            _db.Set<RegIndustryEntity>().Remove(entity);
            await _db.SaveChangesAsync(ct);

            return true;
        }
    }
}