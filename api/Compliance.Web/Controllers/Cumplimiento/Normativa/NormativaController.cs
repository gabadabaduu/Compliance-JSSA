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

        // GET: api/Normativa
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NormativaDto>>> GetAll(CancellationToken ct)
        {
            var items = await _service.GetAllAsync(ct);
            return Ok(items);
        }

        // GET: api/Normativa/{id}
        [HttpGet("{id:long}")]
        public async Task<ActionResult<NormativaDto>> GetById(long id, CancellationToken ct)
        {
            var item = await _service.GetByIdAsync(id, ct);
            if (item == null) return NotFound();
            return Ok(item);
        }

        // POST: api/Normativa
        [HttpPost]
        public async Task<ActionResult<NormativaDto>> Create([FromBody] CreateNormativaDto dto, CancellationToken ct)
        {
            var created = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // PUT: api/Normativa/{id}
        [HttpPut("{id:long}")]
        public async Task<ActionResult<NormativaDto>> Update(long id, [FromBody] UpdateNormativaDto dto, CancellationToken ct)
        {
            if (id != dto.Id) return BadRequest("ID mismatch");

            var updated = await _service.UpdateAsync(dto, ct);
            return Ok(updated);
        }

        // DELETE: api/Normativa/{id}
        [HttpDelete("{id:long}")]
        public async Task<ActionResult> Delete(long id, CancellationToken ct)
        {
            var deleted = await _service.DeleteAsync(id, ct);
            if (!deleted) return NotFound();
            return NoContent();
        }

        // GET: api/Normativa/status/{status}
        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<NormativaDto>>> GetByStatus(RegulationStatus status, CancellationToken ct)
        {
            var items = await _service.GetByStatusAsync(status, ct);
            return Ok(items);
        }

        // GET:  api/Normativa/year/{year}
        [HttpGet("year/{year:int}")]
        public async Task<ActionResult<IEnumerable<NormativaDto>>> GetByYear(int year, CancellationToken ct)
        {
            var items = await _service.GetByYearAsync(year, ct);
            return Ok(items);
        }
    }
}