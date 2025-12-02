using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Normograma.Dtos;
using Compliance.Core.Modules.Normograma.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Compliance.Web.Controllers.Normograma
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class NormogramaController : ControllerBase
    {
        private readonly INormogramaService _service;
        public NormogramaController(INormogramaService service) => _service = service;

        // GET: api/Normograma/names
        [HttpGet("names")]
        public async Task<ActionResult<IEnumerable<NormogramaNameDto>>> GetNames(CancellationToken ct)
        {
            var items = await _service.GetAllNamesAsync(ct);
            return Ok(items);
        }

        // GET: api/Normograma/{id}
        [HttpGet("{id:long}")]
        public async Task<ActionResult<NormogramaNameDto>> GetById(long id, CancellationToken ct)
        {
            var item = await _service.GetByIdAsync(id, ct);
            if (item == null) return NotFound();
            return Ok(item);
        }
    }
}