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
    public class RopaDepartmentRepository : IRopaDepartmentRepository
    {
        private readonly AppDbContext _db;
        public RopaDepartmentRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<RopaDepartmentDto>> GetAllAsync(CancellationToken ct = default)
        {
            return await _db.Set<RopaDepartmentEntity>()
                .AsNoTracking()
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        public async Task<RopaDepartmentDto?> GetByIdAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaDepartmentEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            return entity == null ? null : MapToDto(entity);
        }

        public async Task<RopaDepartmentDto> CreateAsync(CreateRopaDepartmentDto dto, CancellationToken ct = default)
        {
            var entity = new RopaDepartmentEntity
            {
                DepartmentName = dto.DepartmentName,
                CreatedBy = dto.CreatedBy,
                UpdatedBy = dto.UpdatedBy
            };

            _db.Set<RopaDepartmentEntity>().Add(entity);
            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<RopaDepartmentDto> UpdateAsync(UpdateRopaDepartmentDto dto, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaDepartmentEntity>()
                .FirstOrDefaultAsync(e => e.Id == dto.Id, ct);

            if (entity == null)
                throw new Exception($"RopaDepartment with ID {dto.Id} not found");

            if (dto.DepartmentName != null) entity.DepartmentName = dto.DepartmentName;
            if (dto.CreatedBy != null) entity.CreatedBy = dto.CreatedBy;
            if (dto.UpdatedBy != null) entity.UpdatedBy = dto.UpdatedBy;

            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaDepartmentEntity>()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            if (entity == null) return false;

            _db.Set<RopaDepartmentEntity>().Remove(entity);
            await _db.SaveChangesAsync(ct);

            return true;
        }

        private static RopaDepartmentDto MapToDto(RopaDepartmentEntity entity)
        {
            return new RopaDepartmentDto
            {
                Id = entity.Id,
                DepartmentName = entity.DepartmentName,
                CreatedBy = entity.CreatedBy,
                UpdatedBy = entity.UpdatedBy
            };
        }
    }
}