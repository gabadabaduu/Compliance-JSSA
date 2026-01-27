using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.Normativa.Dtos;
using Compliance.Core.Modules.Cumplimiento.Normativa.Interfaces;

namespace Compliance.Infrastructure.Modules.Cumplimiento.Normativa.Services
{
    public class NormativaService : INormativaService
    {
        private readonly INormativaRepository _repository;
        public NormativaService(INormativaRepository repository) => _repository = repository;

        public Task<IEnumerable<NormativaDto>> GetAllAsync(CancellationToken ct = default)
    => _repository.GetAllowedAsync(ct);

        public Task<NormativaDto?> GetByIdAsync(long id, CancellationToken ct = default)
            => _repository.GetByIdAsync(id, ct);

        public Task<NormativaDto> CreateAsync(CreateNormativaDto dto, CancellationToken ct = default)
            => _repository.CreateAsync(dto, ct);

        public Task<NormativaDto> UpdateAsync(UpdateNormativaDto dto, CancellationToken ct = default)
            => _repository.UpdateAsync(dto, ct);

        public Task<bool> DeleteAsync(long id, CancellationToken ct = default)
            => _repository.DeleteAsync(id, ct);

        public Task<IEnumerable<NormativaDto>> GetByStatusAsync(string status, CancellationToken ct = default)
            => _repository.GetByStatusAsync(status, ct);

        public Task<IEnumerable<NormativaDto>> GetByIndustryAsync(int industryId, CancellationToken ct = default)
            => _repository.GetByIndustryAsync(industryId, ct);

        public Task<IEnumerable<NormativaDto>> GetByAuthorityAsync(int authorityId, CancellationToken ct = default)
            => _repository.GetByAuthorityAsync(authorityId, ct);

        public Task<IEnumerable<NormativaDto>> GetByYearAsync(int year, CancellationToken ct = default)
            => _repository.GetByYearAsync(year, ct);
        public Task<IEnumerable<NormativaDto>> GetForCompanyAsync(string companyName, CancellationToken ct = default)
            => _repository.GetForCompanyAsync(companyName, ct);
        public Task<IEnumerable<NormativaDto>> GetFilteredAsync(
    int? type,
    string? issueDate,
    int? year,
    string? regulation,
    int? authority,
    int? industry,
    int? domain,
    string? status,
    string? companyName,
    CancellationToken ct = default)
        {
            return _repository.GetFilteredAsync(type, issueDate, year, regulation, authority, industry, domain, status, companyName, ct);
        }
    }
}