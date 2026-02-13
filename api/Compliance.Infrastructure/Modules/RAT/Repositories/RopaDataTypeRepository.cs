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
    public class RopaDataTypeRepository : IRopaDataTypeRepository
    {
        private readonly AppDbContext _db;
        public RopaDataTypeRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<RopaDataTypeDto>> GetAllAsync(CancellationToken ct = default)
        {
            return await _db.Set<RopaDataTypeEntity>()
                .AsNoTracking()
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        public async Task<RopaDataTypeDto?> GetByIdAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaDataTypeEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            return entity == null ? null : MapToDto(entity);
        }

        public async Task<RopaDataTypeDto> CreateAsync(CreateRopaDataTypeDto dto, CancellationToken ct = default)
        {
            var entity = new RopaDataTypeEntity
            {
                DataType = dto.DataType,
                DataCategory = dto.DataCategory,
                DataGroup = dto.DataGroup,
                CreatedBy = dto.CreatedBy,
                UpdatedBy = dto.UpdatedBy
            };

            _db.Set<RopaDataTypeEntity>().Add(entity);
            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<RopaDataTypeDto> UpdateAsync(UpdateRopaDataTypeDto dto, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaDataTypeEntity>()
                .FirstOrDefaultAsync(e => e.Id == dto.Id, ct);

            if (entity == null)
                throw new Exception($"RopaDataType with ID {dto.Id} not found");

            if (dto.DataType != null) entity.DataType = dto.DataType;
            if (dto.DataCategory != null) entity.DataCategory = dto.DataCategory;
            if (dto.DataGroup != null) entity.DataGroup = dto.DataGroup;
            if (dto.CreatedBy != null) entity.CreatedBy = dto.CreatedBy;
            if (dto.UpdatedBy != null) entity.UpdatedBy = dto.UpdatedBy;

            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaDataTypeEntity>()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            if (entity == null) return false;

            _db.Set<RopaDataTypeEntity>().Remove(entity);
            await _db.SaveChangesAsync(ct);

            return true;
        }

        private static RopaDataTypeDto MapToDto(RopaDataTypeEntity entity)
        {
            return new RopaDataTypeDto
            {
                Id = entity.Id,
                DataType = entity.DataType,
                DataCategory = entity.DataCategory,
                DataGroup = entity.DataGroup,
                CreatedBy = entity.CreatedBy,
                UpdatedBy = entity.UpdatedBy
            };
        }
    }
}