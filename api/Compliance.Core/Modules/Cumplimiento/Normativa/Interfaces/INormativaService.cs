using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.Normativa.Dtos;

namespace Compliance.Core.Modules.Cumplimiento.Normativa.Interfaces
{
    public interface INormativaService
    {
        Task<IEnumerable<NormativaDto>> GetAllAsync(CancellationToken ct = default);
        Task<NormativaDto?> GetByIdAsync(long id, CancellationToken ct = default);
        Task<NormativaDto> CreateAsync(CreateNormativaDto dto, CancellationToken ct = default);
        Task<NormativaDto> UpdateAsync(UpdateNormativaDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(long id, CancellationToken ct = default);
        Task<IEnumerable<NormativaDto>> GetByStatusAsync(string status, CancellationToken ct = default);
        Task<IEnumerable<NormativaDto>> GetByIndustryAsync(int industryId, CancellationToken ct = default);
        Task<IEnumerable<NormativaDto>> GetByAuthorityAsync(int authorityId, CancellationToken ct = default);
        Task<IEnumerable<NormativaDto>> GetByYearAsync(int year, CancellationToken ct = default);
        Task<IEnumerable<NormativaDto>> GetForCompanyAsync(string companyName, CancellationToken ct = default);
        Task<IEnumerable<NormativaDto>> GetFilteredAsync(
            int? type,
            string? issueDate,
            int? year,
            string? regulation,
            int? authority,
            int? industry,
            int? domain,
            string? status,
            string? companyName,
            CancellationToken ct = default);
        //Task<IEnumerable<NormativaDto>> GetAllowedAsync(CancellationToken ct = default);
        Task<NormativaDto?> GetLatestAsync(CancellationToken ct = default);
    }
}