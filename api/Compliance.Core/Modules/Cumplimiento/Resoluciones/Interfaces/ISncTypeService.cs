using Compliance.Core.Modules.Cumplimiento.SncType.Dtos;

namespace Compliance.Core.Modules.Cumplimiento.SncType.Interfaces
{
	public interface ISncTypeService
	{
		Task<IEnumerable<SncTypeDto>> GetAllAsync(CancellationToken ct = default);
		Task<SncTypeDto?> GetByIdAsync(int id, CancellationToken ct = default);
		Task<SncTypeDto> CreateAsync(CreateSncTypeDto dto, CancellationToken ct = default);
		Task<SncTypeDto> UpdateAsync(UpdateSncTypeDto dto, CancellationToken ct = default);
		Task<bool> DeleteAsync(int id, CancellationToken ct = default);
	}
}