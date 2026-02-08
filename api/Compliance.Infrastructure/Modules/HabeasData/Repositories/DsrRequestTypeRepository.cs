using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.DSR.Dtos;
using Compliance.Core.Modules.DSR.Interfaces;
using Compliance.Infrastructure.Data;
using Compliance.Infrastructure.Modules.DSR.Entities;
using Microsoft.EntityFrameworkCore;

namespace Compliance.Infrastructure.Modules.DSR.Repositories
{
    public class DsrRequestTypeRepository : IDsrRequestTypeRepository
    {
        private readonly AppDbContext _db;
        public DsrRequestTypeRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<DsrRequestTypeDto>> GetAllAsync(CancellationToken ct = default)
        {
            return await _db.Set<DsrRequestTypeEntity>()
                .AsNoTracking()
                .OrderBy(e => e.Type)
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        public async Task<DsrRequestTypeDto?> GetByIdAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<DsrRequestTypeEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            return entity != null ? MapToDto(entity) : null;
        }

        public async Task<DsrRequestTypeDto> CreateAsync(CreateDsrRequestTypeDto dto, CancellationToken ct = default)
        {
            var entity = new DsrRequestTypeEntity
            {
                Type = dto.Type,
                Category = dto.Category,
                InitialTerm = dto.InitialTerm,
                InitialTermDescription = dto.InitialTermDescription,
                ExtensionTerm = dto.ExtensionTerm,
                ExtensionTermDescription = dto.ExtensionTermDescription
            };

            _db.Set<DsrRequestTypeEntity>().Add(entity);
            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<DsrRequestTypeDto> UpdateAsync(UpdateDsrRequestTypeDto dto, CancellationToken ct = default)
        {
            var entity = await _db.Set<DsrRequestTypeEntity>()
                .FirstOrDefaultAsync(e => e.Id == dto.Id, ct);

            if (entity == null)
                throw new Exception($"DsrRequestType with ID {dto.Id} not found");

            if (dto.Type != null) entity.Type = dto.Type;
            if (dto.Category != null) entity.Category = dto.Category;
            if (dto.InitialTerm != null) entity.InitialTerm = dto.InitialTerm;
            if (dto.InitialTermDescription != null) entity.InitialTermDescription = dto.InitialTermDescription;
            if (dto.ExtensionTerm != null) entity.ExtensionTerm = dto.ExtensionTerm;
            if (dto.ExtensionTermDescription != null) entity.ExtensionTermDescription = dto.ExtensionTermDescription;

            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<DsrRequestTypeEntity>()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            if (entity == null) return false;

            _db.Set<DsrRequestTypeEntity>().Remove(entity);
            await _db.SaveChangesAsync(ct);

            return true;
        }

        private static DsrRequestTypeDto MapToDto(DsrRequestTypeEntity entity)
        {
            return new DsrRequestTypeDto
            {
                Id = entity.Id,
                Type = entity.Type,
                Category = entity.Category,
                InitialTerm = entity.InitialTerm,
                InitialTermDescription = entity.InitialTermDescription,
                ExtensionTerm = entity.ExtensionTerm,
                ExtensionTermDescription = entity.ExtensionTermDescription
            };
        }
    }
}