using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.RegDomains.Dtos;
using Compliance.Core.Modules.Cumplimiento.RegDomains.Interfaces;

namespace Compliance.Infrastructure.Modules.Cumplimiento.RegDomains.Services
{
    public class RegDomainService : IRegDomainService
    {
        private readonly IRegDomainRepository _repository;
        public RegDomainService(IRegDomainRepository repository) => _repository = repository;

        public Task<IEnumerable<RegDomainDto>> GetAllAsync(CancellationToken ct = default)
            => _repository.GetAllAsync(ct);

        public Task<RegDomainDto?> GetByIdAsync(int id, CancellationToken ct = default)
            => _repository.GetByIdAsync(id, ct);

        public Task<RegDomainDto> CreateAsync(CreateRegDomainDto dto, CancellationToken ct = default)
            => _repository.CreateAsync(dto, ct);

        public Task<RegDomainDto> UpdateAsync(UpdateRegDomainDto dto, CancellationToken ct = default)
            => _repository.UpdateAsync(dto, ct);

        public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
            => _repository.DeleteAsync(id, ct);
    }
}