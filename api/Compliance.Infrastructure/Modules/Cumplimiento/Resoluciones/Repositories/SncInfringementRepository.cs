using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.SncInfringements.Dtos;
using Compliance.Core.Modules.Cumplimiento.SncInfringements.Interfaces;
using Compliance.Infrastructure.Data;
using Compliance.Infrastructure.Modules.Cumplimiento.SncInfringements.Entities;
using Microsoft.EntityFrameworkCore;

namespace Compliance.Infrastructure.Modules.Cumplimiento.SncInfringements.Repositories
{
    public class SncInfringementRepository : ISncInfringementRepository
    {
        private readonly AppDbContext _db;
        public SncInfringementRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<SncInfringementDto>> GetAllAsync(CancellationToken ct = default)
        {
            return await _db.Set<SncInfringementEntity>()
                .AsNoTracking()
                .OrderBy(e => e.Statute).ThenBy(e => e.Article)
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        public async Task<SncInfringementDto?> GetByIdAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<SncInfringementEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            return entity != null ? MapToDto(entity) : null;
        }

        public async Task<SncInfringementDto> CreateAsync(CreateSncInfringementDto dto, CancellationToken ct = default)
        {
            var entity = new SncInfringementEntity
            {
                Statute = dto.Statute,
                Article = dto.Article,
                Section = dto.Section,
                Description = dto.Description,
                Interpretation = dto.Interpretation
            };

            _db.Set<SncInfringementEntity>().Add(entity);
            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<SncInfringementDto> UpdateAsync(UpdateSncInfringementDto dto, CancellationToken ct = default)
        {
            var entity = await _db.Set<SncInfringementEntity>()
                .FirstOrDefaultAsync(e => e.Id == dto.Id, ct);

            if (entity == null)
                throw new Exception($"SncInfringement with ID {dto.Id} not found");

            if (dto.Statute.HasValue) entity.Statute = dto.Statute.Value;
            if (dto.Article.HasValue) entity.Article = dto.Article.Value;
            if (dto.Section != null) entity.Section = dto.Section;
            if (dto.Description != null) entity.Description = dto.Description;
            if (dto.Interpretation != null) entity.Interpretation = dto.Interpretation;

            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<SncInfringementEntity>()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            if (entity == null) return false;

            _db.Set<SncInfringementEntity>().Remove(entity);
            await _db.SaveChangesAsync(ct);

            return true;
        }

        public async Task<IEnumerable<SncInfringementDto>> GetByStatuteAsync(int statuteId, CancellationToken ct = default)
        {
            return await _db.Set<SncInfringementEntity>()
                .AsNoTracking()
                .Where(e => e.Statute == statuteId)
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        private static SncInfringementDto MapToDto(SncInfringementEntity entity)
        {
            return new SncInfringementDto
            {
                Id = entity.Id,
                Statute = entity.Statute,
                Article = entity.Article,
                Section = entity.Section,
                Description = entity.Description,
                Interpretation = entity.Interpretation
            };
        }
    }
}