using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Compliance.Core.Modules.Cumplimiento.SncInfringements.Dtos;
using Compliance.Core.Modules.Cumplimiento.SncInfringements.Interfaces;

namespace Compliance.Web.Controllers.Cumplimiento.SncInfringements
{
    [Authorize]
    [ApiController]
    [Route("api/Resolutions/catalog/infringements")]
    public class SncInfringementController : ControllerBase
    {
        private readonly ISncInfringementService _service;

        public SncInfringementController(ISncInfringementService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SncInfringementDto>>> GetAll(CancellationToken ct)
        {
            var result = await _service.GetAllAsync(ct);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SncInfringementDto>> GetById(int id, CancellationToken ct)
        {
            var result = await _service.GetByIdAsync(id, ct);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<SncInfringementDto>> Create([FromBody] CreateSncInfringementDto dto, CancellationToken ct)
        {
            var result = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SncInfringementDto>> Update(int id, [FromBody] UpdateSncInfringementDto dto, CancellationToken ct)
        {
            if (id != dto.Id) return BadRequest();
            var result = await _service.UpdateAsync(dto, ct);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id, CancellationToken ct)
        {
            var result = await _service.DeleteAsync(id, ct);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpGet("statute/{statuteId}")]
        public async Task<ActionResult<IEnumerable<SncInfringementDto>>> GetByStatute(int statuteId, CancellationToken ct)
        {
            var result = await _service.GetByStatuteAsync(statuteId, ct);
            return Ok(result);
        }
    }
}