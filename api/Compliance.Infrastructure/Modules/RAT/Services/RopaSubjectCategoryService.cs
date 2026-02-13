using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.ROPA.Dtos;
using Compliance.Core.Modules.ROPA.Interfaces;

namespace Compliance.Infrastructure.Modules.ROPA.Services
{
    public class RopaSubjectCategoryService : IRopaSubjectCategoryService
    {
        private readonly IRopaSubjectCategoryRepository _repository;
        public RopaSubjectCategoryService(IRopaSubjectCategoryRepository repository) => _repository = repository;

        public Task<IEnumerable<RopaSubjectCategoryDto>> GetAllAsync(CancellationToken ct = default)
            => _repository.GetAllAsync(ct);

        public Task<RopaSubjectCategoryDto?> GetByIdAsync(int id, CancellationToken ct = default)
            => _repository.GetByIdAsync(id, ct);

        public Task<RopaSubjectCategoryDto> CreateAsync(CreateRopaSubjectCategoryDto dto, CancellationToken ct = default)
            => _repository.CreateAsync(dto, ct);

        public Task<RopaSubjectCategoryDto> UpdateAsync(UpdateRopaSubjectCategoryDto dto, CancellationToken ct = default)
            => _repository.UpdateAsync(dto, ct);

        public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
            => _repository.DeleteAsync(id, ct);
    }
}