using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.Sancion.Dtos;
using Compliance.Core.Modules.Cumplimiento.Sancion.Interfaces;
using Compliance.Infrastructure.Data;
using Compliance.Infrastructure.Modules.Cumplimiento.Sancion.Entities;
using Microsoft.EntityFrameworkCore;

namespace Compliance.Infrastructure.Modules.Cumplimiento.Sancion.Repositories
{
    public class SancionRepository : ISancionRepository
    {
        private readonly AppDbContext _db;
        public SancionRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<SancionDto>> GetAllAsync(CancellationToken ct = default)
        {
            return await _db.Set<SancionEntity>()
                .AsNoTracking()
                .OrderByDescending(e => e.Id)
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        public async Task<SancionDto?> GetByIdAsync(long id, CancellationToken ct = default)
        {
            var entity = await _db.Set<SancionEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            return entity != null ? MapToDto(entity) : null;
        }

        public async Task<SancionDto> CreateAsync(CreateSancionDto dto, CancellationToken ct = default)
        {
            var entity = new SancionEntity
            {
                Number = dto.Number,
                Entity = dto.Entity,
                Facts = dto.Facts,
                Stage = dto.Stage,
                Status = dto.Status,
                // ✅ CAMBIO: Solo asignar si tiene valor, sino dejar null
                Initial = dto.Initial > 0 ? dto.Initial : null,
                Reconsideration = dto.Reconsideration > 0 ? dto.Reconsideration : null,
                Appeal = dto.Appeal > 0 ? dto.Appeal : null
            };

            _db.Set<SancionEntity>().Add(entity);
            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<SancionDto> UpdateAsync(UpdateSancionDto dto, CancellationToken ct = default)
        {
            var entity = await _db.Set<SancionEntity>()
                .FirstOrDefaultAsync(e => e.Id == dto.Id, ct);

            if (entity == null)
                throw new Exception($"Sancion with ID {dto.Id} not found");

            if (dto.Number.HasValue) entity.Number = dto.Number.Value;
            if (dto.Entity.HasValue) entity.Entity = dto.Entity.Value;
            if (dto.Facts != null) entity.Facts = dto.Facts;
            if (dto.Stage != null) entity.Stage = dto.Stage;
            if (dto.Status != null) entity.Status = dto.Status;

            // ✅ CAMBIO:  Permitir asignar null explícitamente
            if (dto.Initial.HasValue) entity.Initial = dto.Initial.Value > 0 ? dto.Initial.Value : null;
            if (dto.Reconsideration.HasValue) entity.Reconsideration = dto.Reconsideration.Value > 0 ? dto.Reconsideration.Value : null;
            if (dto.Appeal.HasValue) entity.Appeal = dto.Appeal.Value > 0 ? dto.Appeal.Value : null;

            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<bool> DeleteAsync(long id, CancellationToken ct = default)
        {
            var entity = await _db.Set<SancionEntity>()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            if (entity == null) return false;

            _db.Set<SancionEntity>().Remove(entity);
            await _db.SaveChangesAsync(ct);

            return true;
        }

        public async Task<IEnumerable<SancionDto>> GetByStatusAsync(string status, CancellationToken ct = default)
        {
            return await _db.Set<SancionEntity>()
                .AsNoTracking()
                .Where(e => e.Status == status)
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        public async Task<IEnumerable<SancionDto>> GetByStageAsync(string stage, CancellationToken ct = default)
        {
            return await _db.Set<SancionEntity>()
                .AsNoTracking()
                .Where(e => e.Stage == stage)
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        public async Task<IEnumerable<SancionDto>> GetByEntityAsync(int entityId, CancellationToken ct = default)
        {
            return await _db.Set<SancionEntity>()
                .AsNoTracking()
                .Where(e => e.Entity == entityId)
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        private static SancionDto MapToDto(SancionEntity entity)
        {
            return new SancionDto
            {
                Id = entity.Id,
                Number = entity.Number,
                Entity = entity.Entity,
                Facts = entity.Facts,
                Stage = entity.Stage,
                Status = entity.Status,
                Initial = entity.Initial,
                Reconsideration = entity.Reconsideration,
                Appeal = entity.Appeal
            };
        }
    }
}