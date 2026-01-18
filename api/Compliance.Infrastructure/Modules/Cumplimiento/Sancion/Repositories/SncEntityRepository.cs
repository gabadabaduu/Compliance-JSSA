using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.SncEntities.Dtos;
using Compliance.Core.Modules.Cumplimiento.SncEntities.Interfaces;
using Compliance.Infrastructure.Data;
using Compliance.Infrastructure.Modules.Cumplimiento.SncEntities.Entities;
using Microsoft.EntityFrameworkCore;

namespace Compliance.Infrastructure.Modules.Cumplimiento.SncEntities.Repositories
{
    public class SncEntityRepository : ISncEntityRepository
    {
        private readonly AppDbContext _db;
        public SncEntityRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<SncEntityDto>> GetAllAsync(CancellationToken ct = default)
        {
            return await _db.Set<SncEntityEntity>()
                .AsNoTracking()
                .OrderBy(e => e.Name)
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        public async Task<SncEntityDto?> GetByIdAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<SncEntityEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            return entity != null ? MapToDto(entity) : null;
        }

        public async Task<SncEntityDto> CreateAsync(CreateSncEntityDto dto, CancellationToken ct = default)
        {
            var entity = new SncEntityEntity
            {
                Name = dto.Name,
                TaxId = dto.TaxId,
                Industry = dto.Industry,
                CompanySize = dto.CompanySize
            };

            _db.Set<SncEntityEntity>().Add(entity);
            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<SncEntityDto> UpdateAsync(UpdateSncEntityDto dto, CancellationToken ct = default)
        {
            var entity = await _db.Set<SncEntityEntity>()
                .FirstOrDefaultAsync(e => e.Id == dto.Id, ct);

            if (entity == null)
                throw new Exception($"SncEntity with ID {dto.Id} not found");

            if (dto.Name != null) entity.Name = dto.Name;
            if (dto.TaxId != null) entity.TaxId = dto.TaxId;
            if (dto.Industry.HasValue) entity.Industry = dto.Industry.Value;
            if (dto.CompanySize != null) entity.CompanySize = dto.CompanySize;

            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<SncEntityEntity>()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            if (entity == null) return false;

            _db.Set<SncEntityEntity>().Remove(entity);
            await _db.SaveChangesAsync(ct);

            return true;
        }

        public async Task<IEnumerable<SncEntityDto>> GetByIndustryAsync(int industryId, CancellationToken ct = default)
        {
            return await _db.Set<SncEntityEntity>()
                .AsNoTracking()
                .Where(e => e.Industry == industryId)
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        public async Task<SncEntityDto?> GetByTaxIdAsync(string taxId, CancellationToken ct = default)
        {
            var entity = await _db.Set<SncEntityEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.TaxId == taxId, ct);

            return entity != null ? MapToDto(entity) : null;
        }

        private static SncEntityDto MapToDto(SncEntityEntity entity)
        {
            return new SncEntityDto
            {
                Id = entity.Id,
                Name = entity.Name,
                TaxId = entity.TaxId,
                Industry = entity.Industry,
                CompanySize = entity.CompanySize
            };
        }
    }
}