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

        // GET: api/Sancion
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SancionDto>>> GetAll(CancellationToken ct)
        {
            var items = await _service.GetAllAsync(ct);
            return Ok(items);
        }

        // GET: api/Sancion/{id}
        [HttpGet("{id:long}")]
        public async Task<ActionResult<SancionDto>> GetById(long id, CancellationToken ct)
        {
            var item = await _service.GetByIdAsync(id, ct);
            if (item == null) return NotFound();
            return Ok(item);
        }

        // POST:  api/Sancion
        [HttpPost]
        public async Task<ActionResult<SancionDto>> Create([FromBody] CreateSancionDto dto, CancellationToken ct)
        {
            var created = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // PUT:  api/Sancion/{id}
        [HttpPut("{id:long}")]
        public async Task<ActionResult<SancionDto>> Update(long id, [FromBody] UpdateSancionDto dto, CancellationToken ct)
        {
            if (id != dto.Id) return BadRequest("ID mismatch");

            var updated = await _service.UpdateAsync(dto, ct);
            return Ok(updated);
        }

        // DELETE: api/Sancion/{id}
        [HttpDelete("{id:long}")]
        public async Task<ActionResult> Delete(long id, CancellationToken ct)
        {
            var deleted = await _service.DeleteAsync(id, ct);
            if (!deleted) return NotFound();
            return NoContent();
        }

        // GET: api/Sancion/status/{status}
        // ✅ VOLVER A USAR ENUM EN EL PARÁMETRO
        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<SancionDto>>> GetByStatus(SanctionStatus status, CancellationToken ct)
        {
            var items = await _service.GetByStatusAsync(status.ToString(), ct);
            return Ok(items);
        }

        // GET: api/Sancion/stage/{stage}
        // ✅ VOLVER A USAR ENUM EN EL PARÁMETRO
        [HttpGet("stage/{stage}")]
        public async Task<ActionResult<IEnumerable<SancionDto>>> GetByStage(SanctionStage stage, CancellationToken ct)
        {
            var items = await _service.GetByStageAsync(stage.ToString(), ct);
            return Ok(items);
        }

        // GET: api/Sancion/entity/{entityId}
        [HttpGet("entity/{entityId:int}")]
        public async Task<ActionResult<IEnumerable<SancionDto>>> GetByEntity(int entityId, CancellationToken ct)
        {
            var items = await _service.GetByEntityAsync(entityId, ct);
            return Ok(items);
        }
    }
}