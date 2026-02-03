using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.DSR.Dtos;
using Compliance.Core.Modules.DSR.Interfaces;

namespace Compliance.Infrastructure.Modules.DSR.Services
{
    public class DsrStatusService : IDsrStatusService
    {
        private readonly IDsrStatusRepository _repository;
        public DsrStatusService(IDsrStatusRepository repository) => _repository = repository;

        public Task<IEnumerable<DsrStatusDto>> GetAllAsync(CancellationToken ct = default)
            => _repository.GetAllAsync(ct);

        public Task<DsrStatusDto?> GetByIdAsync(int id, CancellationToken ct = default)
            => _repository.GetByIdAsync(id, ct);

        public Task<DsrStatusDto> CreateAsync(CreateDsrStatusDto dto, CancellationToken ct = default)
            => _repository.CreateAsync(dto, ct);

        public Task<DsrStatusDto> UpdateAsync(UpdateDsrStatusDto dto, CancellationToken ct = default)
            => _repository.UpdateAsync(dto, ct);

        public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
            => _repository.DeleteAsync(id, ct);
    }
}