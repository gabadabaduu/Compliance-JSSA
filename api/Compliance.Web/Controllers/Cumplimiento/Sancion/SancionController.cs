using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.Sancion.Dtos;
using Compliance.Core.Modules.Cumplimiento.Sancion.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Compliance.Web.Controllers.Cumplimiento.Sancion
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SancionController : ControllerBase
    {
        private readonly ISancionService _service;
        public SancionController(ISancionService service) => _service = service;

        // GET: api/Sancion/names
        [HttpGet("names")]
        public async Task<ActionResult<IEnumerable<SancionNameDto>>> GetNames(CancellationToken ct)
        {
            var items = await _service.GetAllNamesAsync(ct);
            return Ok(items);
        }

        // GET: api/Sancion/{id}
        [HttpGet("{id:long}")]
        public async Task<ActionResult<SancionNameDto>> GetById(long id, CancellationToken ct)
        {
            var item = await _service.GetByIdAsync(id, ct);
            if (item == null) return NotFound();
            return Ok(item);
        }
    }
}