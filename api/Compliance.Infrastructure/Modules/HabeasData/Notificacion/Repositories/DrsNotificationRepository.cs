using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.HabeasData.Notificacion.Dtos;
using Compliance.Core.Modules.HabeasData.Notificacion.Interfaces;
using Compliance.Infrastructure.Data;
using Compliance.Infrastructure.Modules.HabeasData.Notificacion.Entities;
using Compliance.Infrastructure.Modules.DSR.Entities;
using Microsoft.EntityFrameworkCore;

namespace Compliance.Infrastructure.Modules.HabeasData.Notificacion.Repositories;

public class DsrNotificationRepository : IDsrNotificationRepository
{
    private readonly AppDbContext _db;

    public DsrNotificationRepository(AppDbContext db) => _db = db;

    public async Task<DsrNotificationDto?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        return await (from n in _db.Set<DsrNotificationEntity>()
                      join d in _db.Set<DsrEntity>() on n.DsrId equals (int)d.Id
                      join rt in _db.Set<DsrRequestTypeEntity>() on d.Type equals rt.Id into rtJoin
                      from rt in rtJoin.DefaultIfEmpty()
                      where n.Id == id
                      select MapToDto(n, d, rt))
                     .FirstOrDefaultAsync(ct);
    }

    public async Task<IEnumerable<DsrNotificationDto>> GetByDsrIdAsync(int dsrId, CancellationToken ct = default)
    {
        return await (from n in _db.Set<DsrNotificationEntity>()
                      join d in _db.Set<DsrEntity>() on n.DsrId equals (int)d.Id
                      join rt in _db.Set<DsrRequestTypeEntity>() on d.Type equals rt.Id into rtJoin
                      from rt in rtJoin.DefaultIfEmpty()
                      where n.DsrId == dsrId
                      orderby n.CreatedAt descending
                      select MapToDto(n, d, rt))
                     .ToListAsync(ct);
    }

    public async Task<IEnumerable<DsrNotificationDto>> GetByRecipientEmailAsync(string email, CancellationToken ct = default)
    {
        return await (from n in _db.Set<DsrNotificationEntity>()
                      join d in _db.Set<DsrEntity>() on n.DsrId equals (int)d.Id
                      join rt in _db.Set<DsrRequestTypeEntity>() on d.Type equals rt.Id into rtJoin
                      from rt in rtJoin.DefaultIfEmpty()
                      where n.RecipientEmail == email
                      orderby n.CreatedAt descending
                      select MapToDto(n, d, rt))
                     .ToListAsync(ct);
    }

    public async Task<int> GetUnreadCountByEmailAsync(string email, CancellationToken ct = default)
    {
        return await _db.Set<DsrNotificationEntity>()
            .AsNoTracking()
            .CountAsync(e => e.RecipientEmail == email, ct);
    }

    public async Task<bool> ExistsAsync(int dsrId, int daysBeforeDue, string recipientEmail, CancellationToken ct = default)
    {
        return await _db.Set<DsrNotificationEntity>()
            .AsNoTracking()
            .AnyAsync(e => e.DsrId == dsrId
                && e.DaysBeforeDue == daysBeforeDue
                && e.RecipientEmail == recipientEmail, ct);
    }

    public async Task<IEnumerable<DsrNotificationDto>> GetPendingAsync(CancellationToken ct = default)
    {
        return await (from n in _db.Set<DsrNotificationEntity>()
                      join d in _db.Set<DsrEntity>() on n.DsrId equals (int)d.Id
                      join rt in _db.Set<DsrRequestTypeEntity>() on d.Type equals rt.Id into rtJoin
                      from rt in rtJoin.DefaultIfEmpty()
                      where n.EmailSent == false
                      orderby n.CreatedAt
                      select MapToDto(n, d, rt))
                     .ToListAsync(ct);
    }

    public async Task<DsrNotificationDto> CreateAsync(CreateDsrNotificationDto dto, CancellationToken ct = default)
    {
        var entity = new DsrNotificationEntity
        {
            DsrId = dto.DsrId,
            RecipientEmail = dto.RecipientEmail,
            RecipientRole = dto.RecipientRole,
            DaysBeforeDue = dto.DaysBeforeDue,
            EmailSent = dto.EmailSent,
            CreatedAt = DateTime.UtcNow
        };

        _db.Set<DsrNotificationEntity>().Add(entity);
        await _db.SaveChangesAsync(ct);

        // Devolver con datos del DSR
        return await GetByIdAsync(entity.Id, ct) ?? new DsrNotificationDto
        {
            Id = entity.Id,
            DsrId = entity.DsrId,
            RecipientEmail = entity.RecipientEmail,
            RecipientRole = entity.RecipientRole,
            DaysBeforeDue = entity.DaysBeforeDue,
            EmailSent = entity.EmailSent,
            CreatedAt = entity.CreatedAt
        };
    }

    public async Task UpdateEmailSentAsync(int id, bool emailSent, CancellationToken ct = default)
    {
        var entity = await _db.Set<DsrNotificationEntity>()
            .FirstOrDefaultAsync(e => e.Id == id, ct);

        if (entity != null)
        {
            entity.EmailSent = emailSent;
            await _db.SaveChangesAsync(ct);
        }
    }

    private static DsrNotificationDto MapToDto(DsrNotificationEntity n, DsrEntity d, DsrRequestTypeEntity? rt)
    {
        return new DsrNotificationDto
        {
            Id = n.Id,
            DsrId = n.DsrId,
            RecipientEmail = n.RecipientEmail,
            RecipientRole = n.RecipientRole,
            DaysBeforeDue = n.DaysBeforeDue,
            EmailSent = n.EmailSent,
            CreatedAt = n.CreatedAt,
            CaseId = d.CaseId,
            FullName = d.FullName,
            RequestType = rt?.Type,
            Status = d.Status,
            DueDate = d.DueDate,
            Tenant = d.Tenant
        };
    }
    public async Task DeleteByDsrIdAsync(int dsrId, CancellationToken ct = default)
    {
        var entities = await _db.Set<DsrNotificationEntity>()
            .Where(e => e.DsrId == dsrId)
            .ToListAsync(ct);

        if (entities.Any())
        {
            _db.Set<DsrNotificationEntity>().RemoveRange(entities);
            await _db.SaveChangesAsync(ct);
        }
    }

}