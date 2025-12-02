using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Ajustes.Dtos;

namespace Compliance.Core.Modules.Ajustes.Interfaces
{
	public interface IAjusteRepository
	{
		Task<IEnumerable<AjusteNameDto>> GetNamesAsync(CancellationToken ct = default);
		Task<AjusteNameDto?> GetByIdAsync(long id, CancellationToken ct = default);
	}
}