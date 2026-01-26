using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.Normativa.Dtos;
using Compliance.Core.Modules.Cumplimiento.Normativa.Interfaces;
using Compliance.Infrastructure.Data;
using Compliance.Infrastructure.Modules.Cumplimiento.Normativa.Entities;
using Microsoft.EntityFrameworkCore;

namespace Compliance.Infrastructure.Modules.Cumplimiento.Normativa.Repositories
{
    public class NormativaRepository : INormativaRepository
    {
        private readonly AppDbContext _db;
        public NormativaRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<NormativaDto>> GetAllAsync(CancellationToken ct = default)
        {
            return await _db.Set<NormativaEntity>()
                .AsNoTracking()
                .OrderByDescending(e => e.IssueDate)
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        public async Task<NormativaDto?> GetByIdAsync(long id, CancellationToken ct = default)
        {
            var entity = await _db.Set<NormativaEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            return entity != null ? MapToDto(entity) : null;
        }

        public async Task<NormativaDto> CreateAsync(CreateNormativaDto dto, CancellationToken ct = default)
        {
            var entity = new NormativaEntity
            {
                Type = dto.Type,
                Number = dto.Number,
                IssueDate = dto.IssueDate,
                Year = dto.Year,
                Regulation = dto.Regulation,
                CommonName = dto.CommonName,
                Industry = dto.Industry,
                Authority = dto.Authority,
                Title = dto.Title,
                Domain = dto.Domain,
                Status = dto.Status,
                Url = dto.Url
            };

            _db.Set<NormativaEntity>().Add(entity);
            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<NormativaDto> UpdateAsync(UpdateNormativaDto dto, CancellationToken ct = default)
        {
            var entity = await _db.Set<NormativaEntity>()
                .FirstOrDefaultAsync(e => e.Id == dto.Id, ct);

            if (entity == null)
                throw new Exception($"Normativa with ID {dto.Id} not found");

            if (dto.Type.HasValue) entity.Type = dto.Type.Value;
            if (dto.Number.HasValue) entity.Number = dto.Number.Value;
            if (dto.IssueDate.HasValue) entity.IssueDate = dto.IssueDate.Value;
            if (dto.Year.HasValue) entity.Year = dto.Year.Value;
            if (dto.Regulation != null) entity.Regulation = dto.Regulation;
            if (dto.CommonName != null) entity.CommonName = dto.CommonName;
            if (dto.Industry.HasValue) entity.Industry = dto.Industry.Value;
            if (dto.Authority.HasValue) entity.Authority = dto.Authority.Value;
            if (dto.Title != null) entity.Title = dto.Title;
            if (dto.Domain.HasValue) entity.Domain = dto.Domain.Value;
            if (dto.Status != null) entity.Status = dto.Status;
            if (dto.Url != null) entity.Url = dto.Url;

            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<bool> DeleteAsync(long id, CancellationToken ct = default)
        {
            var entity = await _db.Set<NormativaEntity>()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            if (entity == null) return false;

            _db.Set<NormativaEntity>().Remove(entity);
            await _db.SaveChangesAsync(ct);

            return true;
        }

        public async Task<IEnumerable<NormativaDto>> GetByStatusAsync(string status, CancellationToken ct = default)
        {
            return await _db.Set<NormativaEntity>()
                .AsNoTracking()
                .Where(e => e.Status == status)
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        public async Task<IEnumerable<NormativaDto>> GetByIndustryAsync(int industryId, CancellationToken ct = default)
        {
            return await _db.Set<NormativaEntity>()
                .AsNoTracking()
                .Where(e => e.Industry == industryId)
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        public async Task<IEnumerable<NormativaDto>> GetByAuthorityAsync(int authorityId, CancellationToken ct = default)
        {
            return await _db.Set<NormativaEntity>()
                .AsNoTracking()
                .Where(e => e.Authority == authorityId)
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        public async Task<IEnumerable<NormativaDto>> GetByYearAsync(int year, CancellationToken ct = default)
        {
            return await _db.Set<NormativaEntity>()
                .AsNoTracking()
                .Where(e => e.Year == year)
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        public async Task<IEnumerable<NormativaDto>> GetFilteredAsync(
    int? type,
    string? issueDate,
    int? year,
    string? regulation,
    int? authority,
    int? industry,
    int? domain,
    string? status,
    CancellationToken ct = default)
        {
            var query = _db.Set<NormativaEntity>().AsNoTracking().AsQueryable();

            if (type.HasValue)
                query = query.Where(r => r.Type == type.Value);

            // ✅ CORRECCIÓN: Comparar solo año, mes y día
            if (!string.IsNullOrWhiteSpace(issueDate))
            {
                if (DateTime.TryParseExact(issueDate, "yyyy-MM-dd",
                    System.Globalization.CultureInfo.InvariantCulture,
                    System.Globalization.DateTimeStyles.None,
                    out var parsedDate))
                {
                    // Comparar año, mes y día por separado (más confiable)
                    query = query.Where(r =>
                        r.IssueDate.Year == parsedDate.Year &&
                        r.IssueDate.Month == parsedDate.Month &&
                        r.IssueDate.Day == parsedDate.Day
                    );
                }
            }

            if (year.HasValue)
                query = query.Where(r => r.Year == year.Value);

            if (!string.IsNullOrWhiteSpace(regulation))
                query = query.Where(r => r.Regulation.Contains(regulation));

            if (authority.HasValue)
                query = query.Where(r => r.Authority == authority.Value);

            if (industry.HasValue)
                query = query.Where(r => r.Industry == industry.Value);

            if (domain.HasValue)
                query = query.Where(r => r.Domain == domain.Value);

            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(r => r.Status == status);

            var results = await query
                .OrderByDescending(r => r.Id)
                .Select(r => MapToDto(r))
                .ToListAsync(ct);

            return results;
        }


        private static NormativaDto MapToDto(NormativaEntity entity)
        {
            return new NormativaDto
            {
                Id = entity.Id,
                Type = entity.Type,
                Number = entity.Number,
                IssueDate = entity.IssueDate,
                Year = entity.Year,
                Regulation = entity.Regulation,
                CommonName = entity.CommonName,
                Industry = entity.Industry,
                Authority = entity.Authority,
                Title = entity.Title,
                Domain = entity.Domain,
                Status = entity.Status,
                Url = entity.Url
            };
        }
    }
}