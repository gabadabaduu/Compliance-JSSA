using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.Normativa.Dtos;
using Compliance.Core.Modules.Cumplimiento.Normativa.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Compliance.Web.Controllers.Cumplimiento.Normativa
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NormativaController : ControllerBase
    {
        private readonly INormativaService _service;
        public NormativaController(INormativaService service) => _service = service;

        // GET: api/Normativa/names
        [HttpGet("names")]
        public async Task<ActionResult<IEnumerable<NormativaNameDto>>> GetNames(CancellationToken ct)
        {
            var items = await _service.GetAllNamesAsync(ct);
            return Ok(items);
        }

        // GET: api/Normativa/{id}
        [HttpGet("{id:long}")]
        public async Task<ActionResult<NormativaNameDto>> GetById(long id, CancellationToken ct)
        {
            var item = await _service.GetByIdAsync(id, ct);
            if (item == null) return NotFound();
            return Ok(item);
        }
    }
}