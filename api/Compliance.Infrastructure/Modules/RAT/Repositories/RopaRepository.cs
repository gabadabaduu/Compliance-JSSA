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
    public class RopaRepository : IRopaRepository
    {
        private readonly AppDbContext _db;
        public RopaRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<RopaDto>> GetAllAsync(string? tenant = null, CancellationToken ct = default)
        {
            var query = _db.Set<RopaEntity>().AsNoTracking();

            if (!string.IsNullOrEmpty(tenant))
            {
                query = query.Where(e => e.Tenant == tenant);
            }

            return await query.Select(e => MapToDto(e)).ToListAsync(ct);
        }

        public async Task<RopaDto?> GetByIdAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            return entity == null ? null : MapToDto(entity);
        }

        public async Task<RopaDto> CreateAsync(CreateRopaDto dto, CancellationToken ct = default)
        {
            var entity = new RopaEntity
            {
                ProcessingActivity = dto.ProcessingActivity,
                CaptureMethod = dto.CaptureMethod,
                SystemId = dto.SystemId,
                DataSource = dto.DataSource,
                DataTypesId = dto.DataTypesId,
                DataCategories = dto.DataCategories,
                SubjectCategoriesId = dto.SubjectCategoriesId,
                PurposesId = dto.PurposesId,
                PurposeDescription = dto.PurposeDescription,
                StorageId = dto.StorageId,
                DataShared = dto.DataShared,
                RecipientsId = dto.RecipientsId,
                RetentionPeriod = dto.RetentionPeriod,
                ProcessOwner = dto.ProcessOwner,
                Tenant = dto.Tenant,
                CreatedBy = dto.CreatedBy,
                UpdatedBy = dto.UpdatedBy
            };

            _db.Set<RopaEntity>().Add(entity);
            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<RopaDto> UpdateAsync(UpdateRopaDto dto, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaEntity>()
                .FirstOrDefaultAsync(e => e.Id == dto.Id, ct);

            if (entity == null)
                throw new Exception($"Ropa with ID {dto.Id} not found");

            if (dto.ProcessingActivity != null) entity.ProcessingActivity = dto.ProcessingActivity;
            if (dto.CaptureMethod != null) entity.CaptureMethod = dto.CaptureMethod;
            if (dto.SystemId.HasValue) entity.SystemId = dto.SystemId;
            if (dto.DataSource != null) entity.DataSource = dto.DataSource;
            if (dto.DataTypesId.HasValue) entity.DataTypesId = dto.DataTypesId;
            if (dto.DataCategories != null) entity.DataCategories = dto.DataCategories;
            if (dto.SubjectCategoriesId.HasValue) entity.SubjectCategoriesId = dto.SubjectCategoriesId;
            if (dto.PurposesId.HasValue) entity.PurposesId = dto.PurposesId;
            if (dto.PurposeDescription != null) entity.PurposeDescription = dto.PurposeDescription;
            if (dto.StorageId.HasValue) entity.StorageId = dto.StorageId;
            if (dto.DataShared != null) entity.DataShared = dto.DataShared;
            if (dto.RecipientsId.HasValue) entity.RecipientsId = dto.RecipientsId;
            if (dto.RetentionPeriod != null) entity.RetentionPeriod = dto.RetentionPeriod;
            if (dto.ProcessOwner.HasValue) entity.ProcessOwner = dto.ProcessOwner;
            if (dto.Tenant != null) entity.Tenant = dto.Tenant;
            if (dto.CreatedBy != null) entity.CreatedBy = dto.CreatedBy;
            if (dto.UpdatedBy != null) entity.UpdatedBy = dto.UpdatedBy;

            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaEntity>()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            if (entity == null) return false;

            _db.Set<RopaEntity>().Remove(entity);
            await _db.SaveChangesAsync(ct);

            return true;
        }

        private static RopaDto MapToDto(RopaEntity entity)
        {
            return new RopaDto
            {
                Id = entity.Id,
                ProcessingActivity = entity.ProcessingActivity,
                CaptureMethod = entity.CaptureMethod,
                SystemId = entity.SystemId,
                DataSource = entity.DataSource,
                DataTypesId = entity.DataTypesId,
                DataCategories = entity.DataCategories,
                SubjectCategoriesId = entity.SubjectCategoriesId,
                PurposesId = entity.PurposesId,
                PurposeDescription = entity.PurposeDescription,
                StorageId = entity.StorageId,
                DataShared = entity.DataShared,
                RecipientsId = entity.RecipientsId,
                RetentionPeriod = entity.RetentionPeriod,
                ProcessOwner = entity.ProcessOwner,
                Tenant = entity.Tenant,
                CreatedBy = entity.CreatedBy,
                UpdatedBy = entity.UpdatedBy
            };
        }
    }
}