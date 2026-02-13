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
    public class RopaEntityRepository : IRopaEntityRepository
    {
        private readonly AppDbContext _db;
        public RopaEntityRepository(AppDbContext db) => _db = db;

        // ✅ ACTUALIZADO: Filtrar por tenant
        public async Task<IEnumerable<RopaEntityDto>> GetAllAsync(string? tenant = null, CancellationToken ct = default)
        {
            var query = _db.Set<RopaEntityEntity>().AsNoTracking();

            // ✅ Si hay tenant, filtrar por empresa
            if (!string.IsNullOrEmpty(tenant))
            {
                query = query.Where(e => e.Tenant == tenant);
            }

            return await query.Select(e => MapToDto(e)).ToListAsync(ct);
        }

        public async Task<RopaEntityDto?> GetByIdAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaEntityEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            return entity == null ? null : MapToDto(entity);
        }

        // ✅ ACTUALIZADO: Agregar tenant al crear
        public async Task<RopaEntityDto> CreateAsync(CreateRopaEntityDto dto, CancellationToken ct = default)
        {
            var entity = new RopaEntityEntity
            {
                Name = dto.Name,
                TaxId = dto.TaxId,
                Type = dto.Type,
                Nature = dto.Nature,
                Address = dto.Address,
                State = dto.State,
                City = dto.City,
                Country = dto.Country,
                LandlineNumber = dto.LandlineNumber,
                MobileNumber = dto.MobileNumber,
                Email = dto.Email,
                Website = dto.Website,
                ServiceDescription = dto.ServiceDescription,
                ContactChannelsId = dto.ContactChannelsId,
                PrivacyPolicyAttachment = dto.PrivacyPolicyAttachment,
                PrivacyPolicyUrl = dto.PrivacyPolicyUrl,
                CreatedBy = dto.CreatedBy,
                UpdatedBy = dto.UpdatedBy,
                Tenant = dto.Tenant // ✅ NUEVO
            };

            _db.Set<RopaEntityEntity>().Add(entity);
            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        // ✅ ACTUALIZADO: Permitir actualizar tenant
        public async Task<RopaEntityDto> UpdateAsync(UpdateRopaEntityDto dto, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaEntityEntity>()
                .FirstOrDefaultAsync(e => e.Id == dto.Id, ct);

            if (entity == null)
                throw new Exception($"RopaEntity with ID {dto.Id} not found");

            if (dto.Name != null) entity.Name = dto.Name;
            if (dto.TaxId != null) entity.TaxId = dto.TaxId;
            if (dto.Type != null) entity.Type = dto.Type;
            if (dto.Nature != null) entity.Nature = dto.Nature;
            if (dto.Address != null) entity.Address = dto.Address;
            if (dto.State != null) entity.State = dto.State;
            if (dto.City != null) entity.City = dto.City;
            if (dto.Country != null) entity.Country = dto.Country;
            if (dto.LandlineNumber != null) entity.LandlineNumber = dto.LandlineNumber;
            if (dto.MobileNumber != null) entity.MobileNumber = dto.MobileNumber;
            if (dto.Email != null) entity.Email = dto.Email;
            if (dto.Website != null) entity.Website = dto.Website;
            if (dto.ServiceDescription != null) entity.ServiceDescription = dto.ServiceDescription;
            if (dto.ContactChannelsId.HasValue) entity.ContactChannelsId = dto.ContactChannelsId;
            if (dto.PrivacyPolicyAttachment != null) entity.PrivacyPolicyAttachment = dto.PrivacyPolicyAttachment;
            if (dto.PrivacyPolicyUrl != null) entity.PrivacyPolicyUrl = dto.PrivacyPolicyUrl;
            if (dto.CreatedBy != null) entity.CreatedBy = dto.CreatedBy;
            if (dto.UpdatedBy != null) entity.UpdatedBy = dto.UpdatedBy;
            if (dto.Tenant != null) entity.Tenant = dto.Tenant; // ✅ NUEVO

            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<RopaEntityEntity>()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            if (entity == null) return false;

            _db.Set<RopaEntityEntity>().Remove(entity);
            await _db.SaveChangesAsync(ct);

            return true;
        }

        // ✅ ACTUALIZADO: Incluir tenant en el DTO
        private static RopaEntityDto MapToDto(RopaEntityEntity entity)
        {
            return new RopaEntityDto
            {
                Id = entity.Id,
                Name = entity.Name,
                TaxId = entity.TaxId,
                Type = entity.Type,
                Nature = entity.Nature,
                Address = entity.Address,
                State = entity.State,
                City = entity.City,
                Country = entity.Country,
                LandlineNumber = entity.LandlineNumber,
                MobileNumber = entity.MobileNumber,
                Email = entity.Email,
                Website = entity.Website,
                ServiceDescription = entity.ServiceDescription,
                ContactChannelsId = entity.ContactChannelsId,
                PrivacyPolicyAttachment = entity.PrivacyPolicyAttachment,
                PrivacyPolicyUrl = entity.PrivacyPolicyUrl,
                CreatedBy = entity.CreatedBy,
                UpdatedBy = entity.UpdatedBy,
                Tenant = entity.Tenant // ✅ NUEVO
            };
        }
    }
}