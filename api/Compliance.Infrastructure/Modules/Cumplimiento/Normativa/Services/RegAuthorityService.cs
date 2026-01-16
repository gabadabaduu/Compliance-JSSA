using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.RegAuthorities.Dtos;
using Compliance.Core.Modules.Cumplimiento.RegAuthorities.Interfaces;

namespace Compliance.Infrastructure.Modules.Cumplimiento.RegAuthorities.Services
{
    public class RegAuthorityService : IRegAuthorityService
    {
        private readonly IRegAuthorityRepository _repository;
        public RegAuthorityService(IRegAuthorityRepository repository) => _repository = repository;

        public Task<IEnumerable<RegAuthorityDto>> GetAllAsync(CancellationToken ct = default)
            => _repository.GetAllAsync(ct);

        public Task<RegAuthorityDto?> GetByIdAsync(int id, CancellationToken ct = default)
            => _repository.GetByIdAsync(id, ct);

        public Task<RegAuthorityDto> CreateAsync(CreateRegAuthorityDto dto, CancellationToken ct = default)
            => _repository.CreateAsync(dto, ct);

        public Task<RegAuthorityDto> UpdateAsync(UpdateRegAuthorityDto dto, CancellationToken ct = default)
            => _repository.UpdateAsync(dto, ct);

        public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
            => _repository.DeleteAsync(id, ct);
    }
}