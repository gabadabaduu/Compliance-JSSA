using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Compliance.Core.Modules.Cumplimiento.SncEntities.Dtos;
using Compliance.Core.Modules.Cumplimiento.SncEntities.Interfaces;

namespace Compliance.Web.Controllers.Cumplimiento.SncEntities
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SncEntityController : ControllerBase
    {
        private readonly ISncEntityService _service;

        public SncEntityController(ISncEntityService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SncEntityDto>>> GetAll(CancellationToken ct)
        {
            var result = await _service.GetAllAsync(ct);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SncEntityDto>> GetById(int id, CancellationToken ct)
        {
            var result = await _service.GetByIdAsync(id, ct);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<SncEntityDto>> Create([FromBody] CreateSncEntityDto dto, CancellationToken ct)
        {
            var result = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SncEntityDto>> Update(int id, [FromBody] UpdateSncEntityDto dto, CancellationToken ct)
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

        [HttpGet("industry/{industryId}")]
        public async Task<ActionResult<IEnumerable<SncEntityDto>>> GetByIndustry(int industryId, CancellationToken ct)
        {
            var result = await _service.GetByIndustryAsync(industryId, ct);
            return Ok(result);
        }

        [HttpGet("taxid/{taxId}")]
        public async Task<ActionResult<SncEntityDto>> GetByTaxId(string taxId, CancellationToken ct)
        {
            var result = await _service.GetByTaxIdAsync(taxId, ct);
            if (result == null) return NotFound();
            return Ok(result);
        }
    }
}