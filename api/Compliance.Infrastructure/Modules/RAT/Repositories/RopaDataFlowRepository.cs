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
    public class RopaDataFlowRepository : IRopaDataFlowRepository
    {
        private readonly AppDbContext _db;
        public RopaDataFlowRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<RopaDataFlowDto>> GetAllAsync(CancellationToken ct = default)
        {
            return await _db.Set<RopaDataFlowEntity>()
                .AsNoTracking()
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        public async Task<RopaDataFlowDto?> GetByIdAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaDataFlowEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            return entity == null ? null : MapToDto(entity);
        }

        public async Task<IEnumerable<RopaDataFlowDto>> GetByEntityIdAsync(int entityId, CancellationToken ct = default)
        {
            return await _db.Set<RopaDataFlowEntity>()
                .AsNoTracking()
                .Where(e => e.EntityId == entityId)
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        public async Task<IEnumerable<RopaDataFlowDto>> GetByProcessingActivityIdAsync(int activityId, CancellationToken ct = default)
        {
            return await _db.Set<RopaDataFlowEntity>()
                .AsNoTracking()
                .Where(e => e.ProcessingActivityId == activityId)
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        public async Task<RopaDataFlowDto> CreateAsync(CreateRopaDataFlowDto dto, CancellationToken ct = default)
        {
            var entity = new RopaDataFlowEntity
            {
                ProcessingActivityId = dto.ProcessingActivityId,
                EntityId = dto.EntityId,
                EntityRole = dto.EntityRole,
                Country = dto.Country,
                ParentEntity = dto.ParentEntity,
                DataAgreement = dto.DataAgreement,
                CreatedBy = dto.CreatedBy,
                UpdatedBy = dto.UpdatedBy
            };

            _db.Set<RopaDataFlowEntity>().Add(entity);
            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<RopaDataFlowDto> UpdateAsync(UpdateRopaDataFlowDto dto, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaDataFlowEntity>()
                .FirstOrDefaultAsync(e => e.Id == dto.Id, ct);

            if (entity == null)
                throw new Exception($"RopaDataFlow with ID {dto.Id} not found");

            if (dto.ProcessingActivityId.HasValue) entity.ProcessingActivityId = dto.ProcessingActivityId;
            if (dto.EntityId.HasValue) entity.EntityId = dto.EntityId;
            if (dto.EntityRole != null) entity.EntityRole = dto.EntityRole;
            if (dto.Country != null) entity.Country = dto.Country;
            if (dto.ParentEntity != null) entity.ParentEntity = dto.ParentEntity;
            if (dto.DataAgreement != null) entity.DataAgreement = dto.DataAgreement;
            if (dto.CreatedBy != null) entity.CreatedBy = dto.CreatedBy;
            if (dto.UpdatedBy != null) entity.UpdatedBy = dto.UpdatedBy;

            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaDataFlowEntity>()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            if (entity == null) return false;

            _db.Set<RopaDataFlowEntity>().Remove(entity);
            await _db.SaveChangesAsync(ct);

            return true;
        }

        private static RopaDataFlowDto MapToDto(RopaDataFlowEntity entity)
        {
            return new RopaDataFlowDto
            {
                Id = entity.Id,
                ProcessingActivityId = entity.ProcessingActivityId,
                EntityId = entity.EntityId,
                EntityRole = entity.EntityRole,
                Country = entity.Country,
                ParentEntity = entity.ParentEntity,
                DataAgreement = entity.DataAgreement,
                CreatedBy = entity.CreatedBy,
                UpdatedBy = entity.UpdatedBy
            };
        }
    }
}