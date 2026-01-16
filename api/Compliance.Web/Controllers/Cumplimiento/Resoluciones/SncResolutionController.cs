using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Compliance.Core.Modules.Cumplimiento.SncResolutions.Dtos;
using Compliance.Core.Modules.Cumplimiento.SncResolutions.Interfaces;

namespace Compliance.Web.Controllers.Cumplimiento.SncResolutions
{
    [Authorize]
    [ApiController]
    [Route("api/Resolutions")]
    public class SncResolutionController : ControllerBase
    {
        private readonly ISncResolutionService _service;

        public SncResolutionController(ISncResolutionService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SncResolutionDto>>> GetAll(CancellationToken ct)
        {
            var result = await _service.GetAllAsync(ct);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SncResolutionDto>> GetById(int id, CancellationToken ct)
        {
            var result = await _service.GetByIdAsync(id, ct);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<SncResolutionDto>> Create([FromBody] CreateSncResolutionDto dto, CancellationToken ct)
        {
            var result = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SncResolutionDto>> Update(int id, [FromBody] UpdateSncResolutionDto dto, CancellationToken ct)
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

        [HttpGet("sanction/{sanctionId}")]
        public async Task<ActionResult<IEnumerable<SncResolutionDto>>> GetBySanction(int sanctionId, CancellationToken ct)
        {
            var result = await _service.GetBySanctionAsync(sanctionId, ct);
            return Ok(result);
        }

        [HttpGet("year/{year}")]
        public async Task<ActionResult<IEnumerable<SncResolutionDto>>> GetByYear(int year, CancellationToken ct)
        {
            var result = await _service.GetByYearAsync(year, ct);
            return Ok(result);
        }

        [HttpGet("outcome/{outcome}")]
        public async Task<ActionResult<IEnumerable<SncResolutionDto>>> GetByOutcome(string outcome, CancellationToken ct)
        {
            var result = await _service.GetByOutcomeAsync(outcome, ct);
            return Ok(result);
        }
    }
}