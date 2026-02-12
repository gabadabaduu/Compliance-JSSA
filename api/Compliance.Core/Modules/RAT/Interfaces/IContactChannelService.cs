using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.ROPA.Dtos;

namespace Compliance.Core.Modules.ROPA.Interfaces
{
    public interface IContactChannelService
    {
        Task<IEnumerable<ContactChannelDto>> GetAllAsync(CancellationToken ct = default);
        Task<ContactChannelDto?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<ContactChannelDto> CreateAsync(CreateContactChannelDto dto, CancellationToken ct = default);
        Task<ContactChannelDto> UpdateAsync(UpdateContactChannelDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}