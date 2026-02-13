using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.ROPA.Dtos;
using Compliance.Core.Modules.ROPA.Interfaces;
using Compliance.Infrastructure.Data;
using Compliance.Infrastructure.Modules.ROPA.Entities;
using Microsoft.EntityFrameworkCore;

namespace Compliance.Infrastructure.Modules.ROPA.Repositories
{
    public class RopaSubjectCategoryRepository : IRopaSubjectCategoryRepository
    {
        private readonly AppDbContext _db;
        public RopaSubjectCategoryRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<RopaSubjectCategoryDto>> GetAllAsync(CancellationToken ct = default)
        {
            return await _db.Set<RopaSubjectCategoryEntity>()
                .AsNoTracking()
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        public async Task<RopaSubjectCategoryDto?> GetByIdAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaSubjectCategoryEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            return entity == null ? null : MapToDto(entity);
        }

        public async Task<RopaSubjectCategoryDto> CreateAsync(CreateRopaSubjectCategoryDto dto, CancellationToken ct = default)
        {
            var entity = new RopaSubjectCategoryEntity
            {
                Name = dto.Name,
                Description = dto.Description,
                CreatedBy = dto.CreatedBy,
                UpdatedBy = dto.UpdatedBy
            };

            _db.Set<RopaSubjectCategoryEntity>().Add(entity);
            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<RopaSubjectCategoryDto> UpdateAsync(UpdateRopaSubjectCategoryDto dto, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaSubjectCategoryEntity>()
                .FirstOrDefaultAsync(e => e.Id == dto.Id, ct);

            if (entity == null)
                throw new Exception($"RopaSubjectCategory with ID {dto.Id} not found");

            if (dto.Name != null) entity.Name = dto.Name;
            if (dto.Description != null) entity.Description = dto.Description;
            if (dto.CreatedBy != null) entity.CreatedBy = dto.CreatedBy;
            if (dto.UpdatedBy != null) entity.UpdatedBy = dto.UpdatedBy;

            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaSubjectCategoryEntity>()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            if (entity == null) return false;

            _db.Set<RopaSubjectCategoryEntity>().Remove(entity);
            await _db.SaveChangesAsync(ct);

            return true;
        }

        private static RopaSubjectCategoryDto MapToDto(RopaSubjectCategoryEntity entity)
        {
            return new RopaSubjectCategoryDto
            {
                Id = entity.Id,
                Name = entity.Name,
                Description = entity.Description,
                CreatedBy = entity.CreatedBy,
                UpdatedBy = entity.UpdatedBy
            };
        }
    }
}