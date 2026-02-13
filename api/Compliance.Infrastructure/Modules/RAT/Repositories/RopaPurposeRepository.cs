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
    public class RopaPurposeRepository : IRopaPurposeRepository
    {
        private readonly AppDbContext _db;
        public RopaPurposeRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<RopaPurposeDto>> GetAllAsync(CancellationToken ct = default)
        {
            return await _db.Set<RopaPurposeEntity>()
                .AsNoTracking()
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        public async Task<RopaPurposeDto?> GetByIdAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaPurposeEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            return entity == null ? null : MapToDto(entity);
        }

        public async Task<RopaPurposeDto> CreateAsync(CreateRopaPurposeDto dto, CancellationToken ct = default)
        {
            var entity = new RopaPurposeEntity
            {
                Name = dto.Name,
                CreatedBy = dto.CreatedBy,
                UpdatedBy = dto.UpdatedBy
            };

            _db.Set<RopaPurposeEntity>().Add(entity);
            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<RopaPurposeDto> UpdateAsync(UpdateRopaPurposeDto dto, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaPurposeEntity>()
                .FirstOrDefaultAsync(e => e.Id == dto.Id, ct);

            if (entity == null)
                throw new Exception($"RopaPurpose with ID {dto.Id} not found");

            if (dto.Name != null) entity.Name = dto.Name;
            if (dto.CreatedBy != null) entity.CreatedBy = dto.CreatedBy;
            if (dto.UpdatedBy != null) entity.UpdatedBy = dto.UpdatedBy;

            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaPurposeEntity>()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            if (entity == null) return false;

            _db.Set<RopaPurposeEntity>().Remove(entity);
            await _db.SaveChangesAsync(ct);

            return true;
        }

        private static RopaPurposeDto MapToDto(RopaPurposeEntity entity)
        {
            return new RopaPurposeDto
            {
                Id = entity.Id,
                Name = entity.Name,
                CreatedBy = entity.CreatedBy,
                UpdatedBy = entity.UpdatedBy
            };
        }
    }
}