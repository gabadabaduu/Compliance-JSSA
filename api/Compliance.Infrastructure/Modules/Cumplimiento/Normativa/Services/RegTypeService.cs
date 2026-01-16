using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.RegTypes.Dtos;
using Compliance.Core.Modules.Cumplimiento.RegTypes.Interfaces;

namespace Compliance.Infrastructure.Modules.Cumplimiento.RegTypes.Services
{
    public class RegTypeService : IRegTypeService
    {
        private readonly IRegTypeRepository _repository;
        public RegTypeService(IRegTypeRepository repository) => _repository = repository;

        public Task<IEnumerable<RegTypeDto>> GetAllAsync(CancellationToken ct = default)
            => _repository.GetAllAsync(ct);

        public Task<RegTypeDto?> GetByIdAsync(int id, CancellationToken ct = default)
            => _repository.GetByIdAsync(id, ct);

        public Task<RegTypeDto> CreateAsync(CreateRegTypeDto dto, CancellationToken ct = default)
            => _repository.CreateAsync(dto, ct);

        public Task<RegTypeDto> UpdateAsync(UpdateRegTypeDto dto, CancellationToken ct = default)
            => _repository.UpdateAsync(dto, ct);

        public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
            => _repository.DeleteAsync(id, ct);
    }
}