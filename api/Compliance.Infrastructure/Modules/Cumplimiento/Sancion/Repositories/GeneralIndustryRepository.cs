using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.GeneralIndustries.Dtos;
using Compliance.Core.Modules.Cumplimiento.GeneralIndustries.Interfaces;
using Compliance.Infrastructure.Data;
using Compliance.Infrastructure.Modules.Cumplimiento.GeneralIndustries.Entities;
using Microsoft.EntityFrameworkCore;

namespace Compliance.Infrastructure.Modules.Cumplimiento.GeneralIndustries.Repositories
{
    public class GeneralIndustryRepository : IGeneralIndustryRepository
    {
        private readonly AppDbContext _db;
        public GeneralIndustryRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<GeneralIndustryDto>> GetAllAsync(CancellationToken ct = default)
        {
            return await _db.Set<GeneralIndustryEntity>()
                .AsNoTracking()
                .OrderBy(e => e.Name)
                .Select(e => new GeneralIndustryDto { Id = e.Id, Name = e.Name })
                .ToListAsync(ct);
        }

        public async Task<GeneralIndustryDto?> GetByIdAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<GeneralIndustryEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            return entity != null ? new GeneralIndustryDto { Id = entity.Id, Name = entity.Name } : null;
        }

        public async Task<GeneralIndustryDto> CreateAsync(CreateGeneralIndustryDto dto, CancellationToken ct = default)
        {
            var entity = new GeneralIndustryEntity { Name = dto.Name };

            _db.Set<GeneralIndustryEntity>().Add(entity);
            await _db.SaveChangesAsync(ct);

            return new GeneralIndustryDto { Id = entity.Id, Name = entity.Name };
        }

        public async Task<GeneralIndustryDto> UpdateAsync(UpdateGeneralIndustryDto dto, CancellationToken ct = default)
        {
            var entity = await _db.Set<GeneralIndustryEntity>()
                .FirstOrDefaultAsync(e => e.Id == dto.Id, ct);

            if (entity == null)
                throw new Exception($"GeneralIndustry with ID {dto.Id} not found");

            if (dto.Name != null) entity.Name = dto.Name;

            await _db.SaveChangesAsync(ct);

            return new GeneralIndustryDto { Id = entity.Id, Name = entity.Name };
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<GeneralIndustryEntity>()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            if (entity == null) return false;

            _db.Set<GeneralIndustryEntity>().Remove(entity);
            await _db.SaveChangesAsync(ct);

            return true;
        }
    }
}