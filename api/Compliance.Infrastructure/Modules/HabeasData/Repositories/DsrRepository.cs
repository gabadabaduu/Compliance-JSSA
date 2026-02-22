using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.DSR.Dtos;
using Compliance.Core.Modules.DSR.Interfaces;
using Compliance.Infrastructure.Data;
using Compliance.Infrastructure.Modules.DSR.Entities;
using Compliance.Infrastructure.Helpers;
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

        public async Task<IEnumerable<DsrDto>> GetByCompanyAsync(string companyName, CancellationToken ct = default)
        {
            return await _db.Set<DsrEntity>()
                .AsNoTracking()
                .Where(e => e.Tenant == companyName)
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
            // ✅ 1. Obtener información del tipo de solicitud
            var requestType = await _db.Set<DsrRequestTypeEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(rt => rt.Id == dto.Type, ct);

            if (requestType == null)
                throw new Exception($"DsrRequestType con ID {dto.Type} no encontrado");

            // ✅ 2. Asegurar que StartDate sea UTC
            var startDateUtc = DateTime.SpecifyKind(dto.StartDate, DateTimeKind.Utc);

            // ✅ 3. Calcular InitialTerm (StartDate + initial_term días hábiles)
            var initialTermDate = BusinessDaysHelper.AddBusinessDays(
                startDateUtc,
                requestType.InitialTerm ?? 0
            );

            // ✅ 4. Calcular TotalTerm y DueDate
            DateTime totalTermDate;
            DateTime dueDate;

            if (dto.ExtensionTerm)
            {
                // Con prórroga: StartDate + (initial_term + extension_term) días hábiles
                var totalDays = (requestType.InitialTerm ?? 0) + (requestType.ExtensionTerm ?? 0);
                totalTermDate = BusinessDaysHelper.AddBusinessDays(startDateUtc, totalDays);
                dueDate = totalTermDate;
            }
            else
            {
                // Sin prórroga: DueDate = InitialTerm
                totalTermDate = initialTermDate;
                dueDate = initialTermDate;
            }

            // ✅ 5. Crear la entidad con todos los datos calculados
            var entity = new DsrEntity
            {
                CaseId = dto.CaseId,
                RequestId = dto.RequestId,
                Type = dto.Type,
                Category = requestType.Category ?? string.Empty,
                FullName = dto.FullName,
                IdType = dto.IdType,
                IdNumber = dto.IdNumber,
                Email = dto.Email,
                RequestDetails = dto.RequestDetails,
                Attachment = dto.Attachment,
                StartDate = startDateUtc,              // ✅ UTC
                DueDate = dueDate,                      // ✅ UTC
                Stage = dto.Stage,
                Status = dto.Status,
                InitialTerm = initialTermDate,          // ✅ UTC
                ExtensionTerm = dto.ExtensionTerm,
                TotalTerm = totalTermDate,              // ✅ UTC
                ClosedAt = dto.ClosedAt.HasValue
                    ? DateTime.SpecifyKind(dto.ClosedAt.Value, DateTimeKind.Utc)
                    : null,
                ResponseContent = dto.ResponseContent.HasValue
                    ? DateTime.SpecifyKind(dto.ResponseContent.Value, DateTimeKind.Utc)
                    : null,
                ResponseAttachment = dto.ResponseAttachment,
                CreatedBy = dto.CreatedBy,
                Tenant = dto.Tenant,
                UpdatedBy = dto.UpdatedBy
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

            // ✅ Variables para detectar si necesitamos recalcular fechas
            bool needsRecalculation = false;
            DateTime? newStartDate = null;
            int? newType = null;
            bool? newExtensionTerm = null;

            // Actualizar campos básicos
            if (dto.CaseId != null) entity.CaseId = dto.CaseId;
            if (dto.RequestId != null) entity.RequestId = dto.RequestId;

            if (dto.Type.HasValue && dto.Type.Value != entity.Type)
            {
                entity.Type = dto.Type.Value;
                newType = dto.Type.Value;
                needsRecalculation = true;
            }

            if (dto.Category != null) entity.Category = dto.Category;
            if (dto.FullName != null) entity.FullName = dto.FullName;
            if (dto.IdType != null) entity.IdType = dto.IdType;
            if (dto.IdNumber != null) entity.IdNumber = dto.IdNumber;
            if (dto.Email != null) entity.Email = dto.Email;
            if (dto.RequestDetails != null) entity.RequestDetails = dto.RequestDetails;
            if (dto.Attachment != null) entity.Attachment = dto.Attachment;

            if (dto.StartDate.HasValue && dto.StartDate.Value != entity.StartDate)
            {
                // ✅ Asegurar UTC
                entity.StartDate = DateTime.SpecifyKind(dto.StartDate.Value, DateTimeKind.Utc);
                newStartDate = entity.StartDate;
                needsRecalculation = true;
            }

            if (dto.Stage != null) entity.Stage = dto.Stage;
            if (dto.Status != null) entity.Status = dto.Status;

            if (dto.ExtensionTerm.HasValue && dto.ExtensionTerm.Value != entity.ExtensionTerm)
            {
                entity.ExtensionTerm = dto.ExtensionTerm.Value;
                newExtensionTerm = dto.ExtensionTerm.Value;
                needsRecalculation = true;
            }

            if (dto.ClosedAt.HasValue)
                entity.ClosedAt = DateTime.SpecifyKind(dto.ClosedAt.Value, DateTimeKind.Utc);

            if (dto.ResponseContent.HasValue)
                entity.ResponseContent = DateTime.SpecifyKind(dto.ResponseContent.Value, DateTimeKind.Utc);

            if (dto.ResponseAttachment.HasValue)
                entity.ResponseAttachment = dto.ResponseAttachment.Value;

            if (dto.CreatedBy != null) entity.CreatedBy = dto.CreatedBy;
            if (dto.Tenant != null) entity.Tenant = dto.Tenant;
            if (dto.UpdatedBy != null) entity.UpdatedBy = dto.UpdatedBy;

            // ✅ Recalcular fechas si cambió StartDate, Type o ExtensionTerm
            if (needsRecalculation)
            {
                var typeId = newType ?? entity.Type;
                var startDate = newStartDate ?? entity.StartDate;
                var extensionTerm = newExtensionTerm ?? entity.ExtensionTerm;

                var requestType = await _db.Set<DsrRequestTypeEntity>()
                    .AsNoTracking()
                    .FirstOrDefaultAsync(rt => rt.Id == typeId, ct);

                if (requestType != null)
                {
                    // ✅ Asegurar que startDate sea UTC antes de calcular
                    var startDateUtc = DateTime.SpecifyKind(startDate, DateTimeKind.Utc);

                    // Recalcular InitialTerm
                    entity.InitialTerm = BusinessDaysHelper.AddBusinessDays(
                        startDateUtc,
                        requestType.InitialTerm ?? 0
                    );

                    // Recalcular TotalTerm y DueDate
                    if (extensionTerm)
                    {
                        var totalDays = (requestType.InitialTerm ?? 0) + (requestType.ExtensionTerm ?? 0);
                        entity.TotalTerm = BusinessDaysHelper.AddBusinessDays(startDateUtc, totalDays);
                        entity.DueDate = entity.TotalTerm;
                    }
                    else
                    {
                        entity.TotalTerm = entity.InitialTerm;
                        entity.DueDate = entity.InitialTerm;
                    }

                    // Actualizar categoría si cambió el tipo
                    if (newType.HasValue)
                    {
                        entity.Category = requestType.Category ?? string.Empty;
                    }
                }
            }

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

        public async Task<IEnumerable<DsrDto>> GetFilteredAsync(DsrFilterDto filters, CancellationToken ct = default)
        {
            var query = _db.Set<DsrEntity>().AsNoTracking().AsQueryable();

            // ✅ Filtro por empresa/tenant (siempre aplicar)
            if (!string.IsNullOrWhiteSpace(filters.CompanyName))
            {
                query = query.Where(e => e.Tenant == filters.CompanyName);
            }

            // ✅ Filtro por tipo
            if (filters.Type.HasValue)
            {
                query = query.Where(e => e.Type == filters.Type.Value);
            }

            // ✅ Filtro por etapa (stage)
            if (!string.IsNullOrWhiteSpace(filters.Stage))
            {
                query = query.Where(e => e.Stage == filters.Stage);
            }

            // ✅ Filtro por estado (status)
            if (!string.IsNullOrWhiteSpace(filters.Status))
            {
                query = query.Where(e => e.Status == filters.Status);
            }

            return await query
                .OrderByDescending(e => e.CreatedAt)
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }
        // ✅ ENDPOINT 1: Petición más próxima a vencerse
        public async Task<DsrDto?> GetNextDueSoonAsync(string? tenant = null, CancellationToken ct = default)
        {
            var query = _db.Set<DsrEntity>().AsNoTracking();

            // Filtrar por tenant
            if (!string.IsNullOrEmpty(tenant))
            {
                query = query.Where(d => d.Tenant == tenant);
            }

            // Solo peticiones abiertas y con due_date en el futuro o hoy
            var today = DateTime.UtcNow.Date;
            var entity = await query
                .Where(d => d.Status == "Abierto" && d.DueDate >= today)
                .OrderBy(d => d.DueDate)
                .FirstOrDefaultAsync(ct);

            return entity == null ? null : MapToDto(entity);
        }

        // ✅ ENDPOINT 2: Peticiones pendientes (status = Abierto)
        public async Task<IEnumerable<DsrDto>> GetPendingAsync(string? tenant = null, CancellationToken ct = default)
        {
            var query = _db.Set<DsrEntity>().AsNoTracking();

            // Filtrar por tenant
            if (!string.IsNullOrEmpty(tenant))
            {
                query = query.Where(d => d.Tenant == tenant);
            }

            return await query
                .Where(d => d.Status == "Abierto")
                .OrderBy(d => d.DueDate) // Las más urgentes primero
                .Select(d => MapToDto(d))
                .ToListAsync(ct);
        }

        // ✅ ENDPOINT 3: Peticiones completadas (status = Cerrado)
        public async Task<IEnumerable<DsrDto>> GetCompletedAsync(string? tenant = null, CancellationToken ct = default)
        {
            var query = _db.Set<DsrEntity>().AsNoTracking();

            // Filtrar por tenant
            if (!string.IsNullOrEmpty(tenant))
            {
                query = query.Where(d => d.Tenant == tenant);
            }

            return await query
                .Where(d => d.Status == "Cerrado")
                .OrderByDescending(d => d.ClosedAt) // Las más recientes primero
                .Select(d => MapToDto(d))
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
                Stage = entity.Stage,              // ✅ Ahora es string
                Status = entity.Status,            // ✅ Ahora es string
                InitialTerm = entity.InitialTerm,
                ExtensionTerm = entity.ExtensionTerm,
                TotalTerm = entity.TotalTerm,
                ClosedAt = entity.ClosedAt,
                ResponseContent = entity.ResponseContent,
                ResponseAttachment = entity.ResponseAttachment,
                CreatedBy = entity.CreatedBy,
                Tenant = entity.Tenant,            // ✅ NUEVO
                UpdatedBy = entity.UpdatedBy       // ✅ NUEVO
            };
        }
    }
}