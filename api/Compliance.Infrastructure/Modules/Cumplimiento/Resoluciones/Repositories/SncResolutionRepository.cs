    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using Compliance.Core.Modules.Cumplimiento.SncResolutions.Dtos;
    using Compliance.Core.Modules.Cumplimiento.SncResolutions.Interfaces;
    using Compliance.Infrastructure.Data;
    using Compliance.Infrastructure.Modules.Cumplimiento.SncResolutions.Entities;
    using Microsoft.EntityFrameworkCore;

    namespace Compliance.Infrastructure.Modules.Cumplimiento.SncResolutions.Repositories
    {
        public class SncResolutionRepository : ISncResolutionRepository
        {
            private readonly AppDbContext _db;
            public SncResolutionRepository(AppDbContext db) => _db = db;

            public async Task<IEnumerable<SncResolutionDto>> GetAllAsync(CancellationToken ct = default)
            {
                return await _db.Set<SncResolutionEntity>()
                    .AsNoTracking()
                    .OrderByDescending(e => e.IssueDate)
                    .Select(e => MapToDto(e))
                    .ToListAsync(ct);
            }

            public async Task<SncResolutionDto?> GetByIdAsync(int id, CancellationToken ct = default)
            {
                var entity = await _db.Set<SncResolutionEntity>()
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.Id == id, ct);

                return entity != null ? MapToDto(entity) : null;
            }

            public async Task<SncResolutionDto> CreateAsync(CreateSncResolutionDto dto, CancellationToken ct = default)
            {
                var entity = new SncResolutionEntity
                {
                    Sanctions = dto.Sanctions,  // ✅ STRING directo
                    Number = dto.Number,
                    IssueDate = dto.IssueDate,
                    Year = dto.Year,
                    Resolution = dto.Resolution,
                    ResolutionType = dto.ResolutionType,
                    Infringements = dto.Infringements,
                    LegalGrounds = dto.LegalGrounds,
                    SanctionType = dto.SanctionType,
                    Amount = dto.Amount,
                    Description = dto.Description,
                    Outcome = dto.Outcome,
                    Orders = dto.Orders,
                    Attachment = dto.Attachment,
                    Url = dto.Url
                };

                _db.Set<SncResolutionEntity>().Add(entity);
                await _db.SaveChangesAsync(ct);

                return MapToDto(entity);
            }

            public async Task<SncResolutionDto> UpdateAsync(UpdateSncResolutionDto dto, CancellationToken ct = default)
            {
                var entity = await _db.Set<SncResolutionEntity>()
                    .FirstOrDefaultAsync(e => e.Id == dto.Id, ct);

                if (entity == null)
                    throw new Exception($"SncResolution with ID {dto.Id} not found");

                if (dto.Sanctions != null) entity.Sanctions = dto.Sanctions;  // ✅ STRING nullable
                if (dto.Number.HasValue) entity.Number = dto.Number.Value;
                if (dto.IssueDate.HasValue) entity.IssueDate = dto.IssueDate.Value;
                if (dto.Year.HasValue) entity.Year = dto.Year.Value;
                if (dto.Resolution != null) entity.Resolution = dto.Resolution;
                if (dto.ResolutionType != null) entity.ResolutionType = dto.ResolutionType;
                if (dto.Infringements.HasValue) entity.Infringements = dto.Infringements.Value;
                if (dto.LegalGrounds != null) entity.LegalGrounds = dto.LegalGrounds;
                if (dto.SanctionType.HasValue) entity.SanctionType = dto.SanctionType.Value;
                if (dto.Amount.HasValue) entity.Amount = dto.Amount.Value;
                if (dto.Description != null) entity.Description = dto.Description;
                if (dto.Outcome != null) entity.Outcome = dto.Outcome;
                if (dto.Orders != null) entity.Orders = dto.Orders;
                if (dto.Attachment != null) entity.Attachment = dto.Attachment;
                if (dto.Url != null) entity.Url = dto.Url;

                await _db.SaveChangesAsync(ct);

                return MapToDto(entity);
            }

            public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
            {
                var entity = await _db.Set<SncResolutionEntity>()
                    .FirstOrDefaultAsync(e => e.Id == id, ct);

                if (entity == null) return false;

                _db.Set<SncResolutionEntity>().Remove(entity);
                await _db.SaveChangesAsync(ct);

                return true;
            }

            public async Task<IEnumerable<SncResolutionDto>> GetBySanctionAsync(string sanctions, CancellationToken ct = default)
            {
                return await _db.Set<SncResolutionEntity>()
                    .AsNoTracking()
                    .Where(e => e.Sanctions == sanctions)  // ✅ Comparación STRING directa
                    .Select(e => MapToDto(e))
                    .ToListAsync(ct);
            }

            public async Task<IEnumerable<SncResolutionDto>> GetByYearAsync(int year, CancellationToken ct = default)
            {
                return await _db.Set<SncResolutionEntity>()
                    .AsNoTracking()
                    .Where(e => e.Year == year)
                    .Select(e => MapToDto(e))
                    .ToListAsync(ct);
            }

            public async Task<IEnumerable<SncResolutionDto>> GetByOutcomeAsync(string outcome, CancellationToken ct = default)
            {
                return await _db.Set<SncResolutionEntity>()
                    .AsNoTracking()
                    .Where(e => e.Outcome == outcome)
                    .Select(e => MapToDto(e))
                    .ToListAsync(ct);
            }

        public async Task<IEnumerable<SncResolutionDto>> GetFilteredAsync(
   string? sanctions,
   string? issueDate,
   int? year,
   string? resolutionType,
   int? infringements,
   int? sanctionType,
   string? outcome,
   CancellationToken ct = default)
        {
            var query = _db.Set<SncResolutionEntity>().AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(sanctions))
                query = query.Where(r => r.Sanctions.Contains(sanctions));

            if (!string.IsNullOrWhiteSpace(issueDate) && DateTime.TryParse(issueDate, out var parsedDate))
                query = query.Where(r => r.IssueDate.Date == parsedDate.Date);

            if (year.HasValue)
                query = query.Where(r => r.Year == year.Value);

            if (!string.IsNullOrWhiteSpace(resolutionType))
                query = query.Where(r => r.ResolutionType == resolutionType);

            if (infringements.HasValue)
                query = query.Where(r => r.Infringements == infringements.Value);

            if (sanctionType.HasValue)
                query = query.Where(r => r.SanctionType == sanctionType.Value);

            if (!string.IsNullOrWhiteSpace(outcome))
                query = query.Where(r => r.Outcome == outcome);

            var results = await query
                .OrderByDescending(r => r.Id)
                .Select(r => MapToDto(r))
                .ToListAsync(ct);

            return results;
        }

        private static SncResolutionDto MapToDto(SncResolutionEntity entity)
            {
                return new SncResolutionDto
                {
                    Id = entity.Id,
                    Sanctions = entity.Sanctions,  // ✅ STRING directo
                    Number = entity.Number,
                    IssueDate = entity.IssueDate,
                    Year = entity.Year,
                    Resolution = entity.Resolution,
                    ResolutionType = entity.ResolutionType,
                    Infringements = entity.Infringements,
                    LegalGrounds = entity.LegalGrounds,
                    SanctionType = entity.SanctionType,
                    Amount = entity.Amount,
                    Description = entity.Description,
                    Outcome = entity.Outcome,
                    Orders = entity.Orders,
                    Attachment = entity.Attachment,
                    Url = entity.Url
                };
            }
        }
    }