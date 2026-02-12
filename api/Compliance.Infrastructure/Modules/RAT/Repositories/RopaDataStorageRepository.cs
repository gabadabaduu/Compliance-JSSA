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
    public class RopaDataStorageRepository : IRopaDataStorageRepository
    {
        private readonly AppDbContext _db;
        public RopaDataStorageRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<RopaDataStorageDto>> GetAllAsync(CancellationToken ct = default)
        {
            return await _db.Set<RopaDataStorageEntity>()
                .AsNoTracking()
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        public async Task<RopaDataStorageDto?> GetByIdAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaDataStorageEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            return entity == null ? null : MapToDto(entity);
        }

        public async Task<RopaDataStorageDto> CreateAsync(CreateRopaDataStorageDto dto, CancellationToken ct = default)
        {
            var entity = new RopaDataStorageEntity
            {
                DbName = dto.DbName,
                RecordCount = dto.RecordCount,
                CreationDate = DateTime.SpecifyKind(dto.CreationDate, DateTimeKind.Utc),
                ProcessingMode = dto.ProcessingMode,
                DbLocation = dto.DbLocation,
                Country = dto.Country,
                SecurityMeasures = dto.SecurityMeasures,
                DbCustodian = dto.DbCustodian,
                CreatedBy = dto.CreatedBy,
                UpdatedBy = dto.UpdatedBy
            };

            _db.Set<RopaDataStorageEntity>().Add(entity);
            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<RopaDataStorageDto> UpdateAsync(UpdateRopaDataStorageDto dto, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaDataStorageEntity>()
                .FirstOrDefaultAsync(e => e.Id == dto.Id, ct);

            if (entity == null)
                throw new Exception($"RopaDataStorage with ID {dto.Id} not found");

            if (dto.DbName != null) entity.DbName = dto.DbName;
            if (dto.RecordCount.HasValue) entity.RecordCount = dto.RecordCount.Value;
            if (dto.CreationDate.HasValue) entity.CreationDate = DateTime.SpecifyKind(dto.CreationDate.Value, DateTimeKind.Utc);
            if (dto.ProcessingMode != null) entity.ProcessingMode = dto.ProcessingMode;
            if (dto.DbLocation != null) entity.DbLocation = dto.DbLocation;
            if (dto.Country != null) entity.Country = dto.Country;
            if (dto.SecurityMeasures != null) entity.SecurityMeasures = dto.SecurityMeasures;
            if (dto.DbCustodian.HasValue) entity.DbCustodian = dto.DbCustodian;
            if (dto.CreatedBy != null) entity.CreatedBy = dto.CreatedBy;
            if (dto.UpdatedBy != null) entity.UpdatedBy = dto.UpdatedBy;

            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaDataStorageEntity>()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            if (entity == null) return false;

            _db.Set<RopaDataStorageEntity>().Remove(entity);
            await _db.SaveChangesAsync(ct);

            return true;
        }

        private static RopaDataStorageDto MapToDto(RopaDataStorageEntity entity)
        {
            return new RopaDataStorageDto
            {
                Id = entity.Id,
                DbName = entity.DbName,
                RecordCount = entity.RecordCount,
                CreationDate = entity.CreationDate,
                ProcessingMode = entity.ProcessingMode,
                DbLocation = entity.DbLocation,
                Country = entity.Country,
                SecurityMeasures = entity.SecurityMeasures,
                DbCustodian = entity.DbCustodian,
                CreatedBy = entity.CreatedBy,
                UpdatedBy = entity.UpdatedBy
            };
        }
    }
}