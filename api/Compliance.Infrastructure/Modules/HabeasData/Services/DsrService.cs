using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.DSR.Dtos;
using Compliance.Core.Modules.DSR.Interfaces;

namespace Compliance.Infrastructure.Modules.DSR.Services
{
    public class DsrService : IDsrService
    {
        private readonly IDsrRepository _repository;
        public DsrService(IDsrRepository repository) => _repository = repository;

        public Task<IEnumerable<DsrDto>> GetAllAsync(CancellationToken ct = default)
            => _repository.GetAllAsync(ct);
        public Task<IEnumerable<DsrDto>> GetByCompanyAsync(string companyName, CancellationToken ct = default)
            => _repository.GetByCompanyAsync(companyName, ct);

        public Task<IEnumerable<DsrDto>> GetFilteredAsync(DsrFilterDto filters, CancellationToken ct = default)
            => _repository.GetFilteredAsync(filters, ct);

        public Task<DsrDto?> GetByIdAsync(long id, CancellationToken ct = default)
            => _repository.GetByIdAsync(id, ct);

        public Task<DsrDto> CreateAsync(CreateDsrDto dto, CancellationToken ct = default)
            => _repository.CreateAsync(dto, ct);

        public Task<DsrDto> UpdateAsync(UpdateDsrDto dto, CancellationToken ct = default)
            => _repository.UpdateAsync(dto, ct);

        public Task<bool> DeleteAsync(long id, CancellationToken ct = default)
            => _repository.DeleteAsync(id, ct);

        public Task<IEnumerable<DsrDto>> GetByCaseIdAsync(string caseId, CancellationToken ct = default)
            => _repository.GetByCaseIdAsync(caseId, ct);

        public Task<IEnumerable<DsrDto>> GetByTypeAsync(int typeId, CancellationToken ct = default)
            => _repository.GetByTypeAsync(typeId, ct);
    }
}