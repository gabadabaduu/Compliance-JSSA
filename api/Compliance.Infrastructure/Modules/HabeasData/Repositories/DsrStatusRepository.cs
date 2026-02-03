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
    public class DsrStatusRepository : IDsrStatusRepository
    {
        private readonly AppDbContext _db;
        public DsrStatusRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<DsrStatusDto>> GetAllAsync(CancellationToken ct = default)
        {
            return await _db.Set<DsrStatusEntity>()
                .AsNoTracking()
                .OrderBy(e => e.WorkflowStatus)
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        public async Task<DsrStatusDto?> GetByIdAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<DsrStatusEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            return entity != null ? MapToDto(entity) : null;
        }

        public async Task<DsrStatusDto> CreateAsync(CreateDsrStatusDto dto, CancellationToken ct = default)
        {
            var entity = new DsrStatusEntity
            {
                WorkflowStatus = dto.WorkflowStatus,
                CaseStatus = dto.CaseStatus
            };

            _db.Set<DsrStatusEntity>().Add(entity);
            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<DsrStatusDto> UpdateAsync(UpdateDsrStatusDto dto, CancellationToken ct = default)
        {
            var entity = await _db.Set<DsrStatusEntity>()
                .FirstOrDefaultAsync(e => e.Id == dto.Id, ct);

            if (entity == null)
                throw new Exception($"DsrStatus with ID {dto.Id} not found");

            if (dto.WorkflowStatus != null) entity.WorkflowStatus = dto.WorkflowStatus;
            if (dto.CaseStatus != null) entity.CaseStatus = dto.CaseStatus;

            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<DsrStatusEntity>()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            if (entity == null) return false;

            _db.Set<DsrStatusEntity>().Remove(entity);
            await _db.SaveChangesAsync(ct);

            return true;
        }

        private static DsrStatusDto MapToDto(DsrStatusEntity entity)
        {
            return new DsrStatusDto
            {
                Id = entity.Id,
                WorkflowStatus = entity.WorkflowStatus,
                CaseStatus = entity.CaseStatus
            };
        }
    }
}