using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.MatrizRiesgo.Dtos;
using Compliance.Core.Modules.MatrizRiesgo.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Compliance.Web.Controllers.MatrizRiesgo
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class MatrizRiesgoController : ControllerBase
    {
        private readonly IMatrizRiesgoService _service;
        public MatrizRiesgoController(IMatrizRiesgoService service) => _service = service;

        // GET: api/MatrizRiesgo/names
        [HttpGet("names")]
        public async Task<ActionResult<IEnumerable<MatrizRiesgoNameDto>>> GetNames(CancellationToken ct)
        {
            var items = await _service.GetAllNamesAsync(ct);
            return Ok(items);
        }

        // GET: api/MatrizRiesgo/{id}
        [HttpGet("{id:long}")]
        public async Task<ActionResult<MatrizRiesgoNameDto>> GetById(long id, CancellationToken ct)
        {
            var item = await _service.GetByIdAsync(id, ct);
            if (item == null) return NotFound();
            return Ok(item);
        }
    }
}