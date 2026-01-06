using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Ajustes.Dtos;
using Compliance.Core.Modules.Ajustes.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Compliance.Web.Controllers.Ajustes
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AjustesController : ControllerBase
    {
        private readonly IAjusteService _service;
        public AjustesController(IAjusteService service) => _service = service;

        // GET: api/Ajustes/names
        [HttpGet("names")]
        public async Task<ActionResult<IEnumerable<AjusteNameDto>>> GetNames(CancellationToken ct)
        {
            var items = await _service.GetAllNamesAsync(ct);
            return Ok(items);
        }

        // GET: api/Ajustes/{id}
        [HttpGet("{id:long}")]
        public async Task<ActionResult<AjusteNameDto>> GetById(long id, CancellationToken ct)
        {
            var item = await _service.GetByIdAsync(id, ct);
            if (item == null) return NotFound();
            return Ok(item);
        }
    }
}