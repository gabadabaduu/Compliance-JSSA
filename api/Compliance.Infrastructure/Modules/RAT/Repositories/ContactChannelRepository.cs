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
    public class ContactChannelRepository : IContactChannelRepository
    {
        private readonly AppDbContext _db;
        public ContactChannelRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<ContactChannelDto>> GetAllAsync(CancellationToken ct = default)
        {
            return await _db.Set<ContactChannelEntity>()
                .AsNoTracking()
                .Select(e => MapToDto(e))
                .ToListAsync(ct);
        }

        public async Task<ContactChannelDto?> GetByIdAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<ContactChannelEntity>()
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            return entity == null ? null : MapToDto(entity);
        }

        public async Task<ContactChannelDto> CreateAsync(CreateContactChannelDto dto, CancellationToken ct = default)
        {
            var entity = new ContactChannelEntity
            {
                ChannelType = dto.ChannelType,
                MobileApp = dto.MobileApp,
                Email = dto.Email,
                Fax = dto.Fax,
                Address = dto.Address,
                Website = dto.Website,
                LandlinePhone = dto.LandlinePhone,
                MobilePhone = dto.MobilePhone,
                CreatedBy = dto.CreatedBy,
                UpdatedBy = dto.UpdatedBy
            };

            _db.Set<ContactChannelEntity>().Add(entity);
            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<ContactChannelDto> UpdateAsync(UpdateContactChannelDto dto, CancellationToken ct = default)
        {
            var entity = await _db.Set<ContactChannelEntity>()
                .FirstOrDefaultAsync(e => e.Id == dto.Id, ct);

            if (entity == null)
                throw new Exception($"ContactChannel with ID {dto.Id} not found");

            if (dto.ChannelType != null) entity.ChannelType = dto.ChannelType;
            if (dto.MobileApp != null) entity.MobileApp = dto.MobileApp;
            if (dto.Email != null) entity.Email = dto.Email;
            if (dto.Fax != null) entity.Fax = dto.Fax;
            if (dto.Address != null) entity.Address = dto.Address;
            if (dto.Website != null) entity.Website = dto.Website;
            if (dto.LandlinePhone != null) entity.LandlinePhone = dto.LandlinePhone;
            if (dto.MobilePhone != null) entity.MobilePhone = dto.MobilePhone;
            if (dto.CreatedBy != null) entity.CreatedBy = dto.CreatedBy;
            if (dto.UpdatedBy != null) entity.UpdatedBy = dto.UpdatedBy;

            await _db.SaveChangesAsync(ct);

            return MapToDto(entity);
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await _db.Set<ContactChannelEntity>()
                .FirstOrDefaultAsync(e => e.Id == id, ct);

            if (entity == null) return false;

            _db.Set<ContactChannelEntity>().Remove(entity);
            await _db.SaveChangesAsync(ct);

            return true;
        }

        private static ContactChannelDto MapToDto(ContactChannelEntity entity)
        {
            return new ContactChannelDto
            {
                Id = entity.Id,
                ChannelType = entity.ChannelType,
                MobileApp = entity.MobileApp,
                Email = entity.Email,
                Fax = entity.Fax,
                Address = entity.Address,
                Website = entity.Website,
                LandlinePhone = entity.LandlinePhone,
                MobilePhone = entity.MobilePhone,
                CreatedBy = entity.CreatedBy,
                UpdatedBy = entity.UpdatedBy
            };
        }
    }
}