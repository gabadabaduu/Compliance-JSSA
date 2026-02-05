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
    public class DsrRepository : IDsrRepository
    {
        private readonly AppDbContext _db;
        public DsrRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<DsrDto>> GetAllAsync(CancellationToken ct = default)
        {
            return await _db.Set<DsrEntity>()
                .AsNoTracking()
                .OrderByDescending(e => e.CreatedAt)
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        public async Task<DsrDto?> GetByIdAsync(long id, CancellationToken ct = default)
        {
            var entity = await _db.Set<DsrEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            return entity != null ? MapToDto(entity) : null;
        }

        public async Task<DsrDto> CreateAsync(CreateDsrDto dto, CancellationToken ct = default)
        {
            var entity = new DsrEntity
            {
                CaseId = dto.CaseId,
                RequestId = dto.RequestId,
                Type = dto.Type,
                Category = dto.Category,
                FullName = dto.FullName,
                IdType = dto.IdType,
                IdNumber = dto.IdNumber,
                Email = dto.Email,
                RequestDetails = dto.RequestDetails,
                Attachment = dto.Attachment,
                StartDate = dto.StartDate,
                DueDate = dto.DueDate,
                Stage = dto.Stage,
                Status = dto.Status,
                InitialTerm = dto.InitialTerm,
                ExtensionTerm = dto.ExtensionTerm,
                TotalTerm = dto.TotalTerm,
                ClosedAt = dto.ClosedAt,
                ResponseContent = dto.ResponseContent,
                ResponseAttachment = dto.ResponseAttachment,
                CreatedBy = dto.CreatedBy // ✅ NUEVO
            };

            _db.Set<DsrEntity>().Add(entity);
            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<DsrDto> UpdateAsync(UpdateDsrDto dto, CancellationToken ct = default)
        {
            var entity = await _db.Set<DsrEntity>()
                .FirstOrDefaultAsync(e => e.Id == dto.Id, ct);

            if (entity == null)
                throw new Exception($"DSR with ID {dto.Id} not found");

            if (dto.CaseId != null) entity.CaseId = dto.CaseId;
            if (dto.RequestId != null) entity.RequestId = dto.RequestId;
            if (dto.Type.HasValue) entity.Type = dto.Type.Value;
            if (dto.Category != null) entity.Category = dto.Category;
            if (dto.FullName != null) entity.FullName = dto.FullName;
            if (dto.IdType != null) entity.IdType = dto.IdType;
            if (dto.IdNumber != null) entity.IdNumber = dto.IdNumber;
            if (dto.Email != null) entity.Email = dto.Email;
            if (dto.RequestDetails != null) entity.RequestDetails = dto.RequestDetails;
            if (dto.Attachment != null) entity.Attachment = dto.Attachment;
            if (dto.StartDate.HasValue) entity.StartDate = dto.StartDate.Value;
            if (dto.DueDate.HasValue) entity.DueDate = dto.DueDate.Value;
            if (dto.Stage.HasValue) entity.Stage = dto.Stage;
            if (dto.Status.HasValue) entity.Status = dto.Status;
            if (dto.InitialTerm.HasValue) entity.InitialTerm = dto.InitialTerm.Value;
            if (dto.ExtensionTerm.HasValue) entity.ExtensionTerm = dto.ExtensionTerm.Value;
            if (dto.TotalTerm.HasValue) entity.TotalTerm = dto.TotalTerm.Value;
            if (dto.ClosedAt.HasValue) entity.ClosedAt = dto.ClosedAt;
            if (dto.ResponseContent.HasValue) entity.ResponseContent = dto.ResponseContent;
            if (dto.ResponseAttachment.HasValue) entity.ResponseAttachment = dto.ResponseAttachment.Value;
            if (dto.CreatedBy != null) entity.CreatedBy = dto.CreatedBy; // ✅ NUEVO

            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<bool> DeleteAsync(long id, CancellationToken ct = default)
        {
            var entity = await _db.Set<DsrEntity>()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            if (entity == null) return false;

            _db.Set<DsrEntity>().Remove(entity);
            await _db.SaveChangesAsync(ct);

            return true;
        }

        public async Task<IEnumerable<DsrDto>> GetByCaseIdAsync(string caseId, CancellationToken ct = default)
        {
            return await _db.Set<DsrEntity>()
                .AsNoTracking()
                .Where(e => e.CaseId == caseId)
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        public async Task<IEnumerable<DsrDto>> GetByTypeAsync(int typeId, CancellationToken ct = default)
        {
            return await _db.Set<DsrEntity>()
                .AsNoTracking()
                .Where(e => e.Type == typeId)
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        private static DsrDto MapToDto(DsrEntity entity)
        {
            return new DsrDto
            {
                Id = entity.Id,
                CaseId = entity.CaseId,
                RequestId = entity.RequestId,
                Type = entity.Type,
                Category = entity.Category,
                FullName = entity.FullName,
                IdType = entity.IdType,
                IdNumber = entity.IdNumber,
                Email = entity.Email,
                RequestDetails = entity.RequestDetails,
                Attachment = entity.Attachment,
                CreatedAt = entity.CreatedAt,
                StartDate = entity.StartDate,
                DueDate = entity.DueDate,
                Stage = entity.Stage,
                Status = entity.Status,
                InitialTerm = entity.InitialTerm,
                ExtensionTerm = entity.ExtensionTerm,
                TotalTerm = entity.TotalTerm,
                ClosedAt = entity.ClosedAt,
                ResponseContent = entity.ResponseContent,
                ResponseAttachment = entity.ResponseAttachment,
                CreatedBy = entity.CreatedBy // ✅ NUEVO
            };
        }
    }
}