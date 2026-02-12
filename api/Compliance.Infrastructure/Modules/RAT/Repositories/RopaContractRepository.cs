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
    public class RopaContractRepository : IRopaContractRepository
    {
        private readonly AppDbContext _db;
        public RopaContractRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<RopaContractDto>> GetAllAsync(CancellationToken ct = default)
        {
            return await _db.Set<RopaContractEntity>()
                .AsNoTracking()
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        public async Task<RopaContractDto?> GetByIdAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaContractEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            return entity == null ? null : MapToDto(entity);
        }

        public async Task<IEnumerable<RopaContractDto>> GetByEntityIdAsync(int entityId, CancellationToken ct = default)
        {
            return await _db.Set<RopaContractEntity>()
                .AsNoTracking()
                .Where(e => e.EntityId == entityId)
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        public async Task<RopaContractDto> CreateAsync(CreateRopaContractDto dto, CancellationToken ct = default)
        {
            var entity = new RopaContractEntity
            {
                ContractId = dto.ContractId,
                EntityId = dto.EntityId,
                ContractType = dto.ContractType,
                StartDate = DateTime.SpecifyKind(dto.StartDate, DateTimeKind.Utc),
                EndDate = DateTime.SpecifyKind(dto.EndDate, DateTimeKind.Utc),
                Status = dto.Status,
                Notes = dto.Notes,
                Attachment = dto.Attachment,
                CreatedBy = dto.CreatedBy,
                UpdatedBy = dto.UpdatedBy
            };

            _db.Set<RopaContractEntity>().Add(entity);
            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<RopaContractDto> UpdateAsync(UpdateRopaContractDto dto, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaContractEntity>()
                .FirstOrDefaultAsync(e => e.Id == dto.Id, ct);

            if (entity == null)
                throw new Exception($"RopaContract with ID {dto.Id} not found");

            if (dto.ContractId != null) entity.ContractId = dto.ContractId;
            if (dto.EntityId.HasValue) entity.EntityId = dto.EntityId.Value;
            if (dto.ContractType != null) entity.ContractType = dto.ContractType;
            if (dto.StartDate.HasValue) entity.StartDate = DateTime.SpecifyKind(dto.StartDate.Value, DateTimeKind.Utc);
            if (dto.EndDate.HasValue) entity.EndDate = DateTime.SpecifyKind(dto.EndDate.Value, DateTimeKind.Utc);
            if (dto.Status != null) entity.Status = dto.Status;
            if (dto.Notes != null) entity.Notes = dto.Notes;
            if (dto.Attachment != null) entity.Attachment = dto.Attachment;
            if (dto.CreatedBy != null) entity.CreatedBy = dto.CreatedBy;
            if (dto.UpdatedBy != null) entity.UpdatedBy = dto.UpdatedBy;

            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaContractEntity>()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            if (entity == null) return false;

            _db.Set<RopaContractEntity>().Remove(entity);
            await _db.SaveChangesAsync(ct);

            return true;
        }

        private static RopaContractDto MapToDto(RopaContractEntity entity)
        {
            return new RopaContractDto
            {
                Id = entity.Id,
                ContractId = entity.ContractId,
                EntityId = entity.EntityId,
                ContractType = entity.ContractType,
                StartDate = entity.StartDate,
                EndDate = entity.EndDate,
                Status = entity.Status,
                Notes = entity.Notes,
                Attachment = entity.Attachment,
                CreatedBy = entity.CreatedBy,
                UpdatedBy = entity.UpdatedBy
            };
        }
    }
}