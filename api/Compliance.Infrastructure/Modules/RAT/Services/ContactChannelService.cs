using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.ROPA.Dtos;
using Compliance.Core.Modules.ROPA.Interfaces;

namespace Compliance.Infrastructure.Modules.ROPA.Services
{
    public class ContactChannelService : IContactChannelService
    {
        private readonly IContactChannelRepository _repository;
        public ContactChannelService(IContactChannelRepository repository) => _repository = repository;

        public Task<IEnumerable<ContactChannelDto>> GetAllAsync(CancellationToken ct = default)
            => _repository.GetAllAsync(ct);

        public Task<ContactChannelDto?> GetByIdAsync(int id, CancellationToken ct = default)
            => _repository.GetByIdAsync(id, ct);

        public Task<ContactChannelDto> CreateAsync(CreateContactChannelDto dto, CancellationToken ct = default)
            => _repository.CreateAsync(dto, ct);

        public Task<ContactChannelDto> UpdateAsync(UpdateContactChannelDto dto, CancellationToken ct = default)
            => _repository.UpdateAsync(dto, ct);

        public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
            => _repository.DeleteAsync(id, ct);
    }
}