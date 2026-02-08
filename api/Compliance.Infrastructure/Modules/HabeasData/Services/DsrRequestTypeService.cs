using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.DSR.Dtos;
using Compliance.Core.Modules.DSR.Interfaces;

namespace Compliance.Infrastructure.Modules.DSR.Services
{
    public class DsrRequestTypeService : IDsrRequestTypeService
    {
        private readonly IDsrRequestTypeRepository _repository;
        public DsrRequestTypeService(IDsrRequestTypeRepository repository) => _repository = repository;

        public Task<IEnumerable<DsrRequestTypeDto>> GetAllAsync(CancellationToken ct = default)
            => _repository.GetAllAsync(ct);

        public Task<DsrRequestTypeDto?> GetByIdAsync(int id, CancellationToken ct = default)
            => _repository.GetByIdAsync(id, ct);

        public Task<DsrRequestTypeDto> CreateAsync(CreateDsrRequestTypeDto dto, CancellationToken ct = default)
            => _repository.CreateAsync(dto, ct);

        public Task<DsrRequestTypeDto> UpdateAsync(UpdateDsrRequestTypeDto dto, CancellationToken ct = default)
            => _repository.UpdateAsync(dto, ct);

        public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
            => _repository.DeleteAsync(id, ct);
    }
}