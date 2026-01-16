using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.Normativa.Dtos;
using Compliance.Core.Modules.Cumplimiento.Normativa.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Compliance.Web.Controllers.Cumplimiento.Normativa
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class NormativaController : ControllerBase
    {
        private readonly INormativaService _service;

        public NormativaController(INormativaService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NormativaDto>>> GetAll(CancellationToken ct)
        {
            var result = await _service.GetAllAsync(ct);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<NormativaDto>> GetById(long id, CancellationToken ct)
        {
            var result = await _service.GetByIdAsync(id, ct);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<NormativaDto>> Create([FromBody] CreateNormativaDto dto, CancellationToken ct)
        {
            var result = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<NormativaDto>> Update(long id, [FromBody] UpdateNormativaDto dto, CancellationToken ct)
        {
            if (id != dto.Id) return BadRequest();
            var result = await _service.UpdateAsync(dto, ct);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(long id, CancellationToken ct)
        {
            var result = await _service.DeleteAsync(id, ct);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<NormativaDto>>> GetByStatus(string status, CancellationToken ct)
        {
            var result = await _service.GetByStatusAsync(status, ct);
            return Ok(result);
        }

        [HttpGet("industry/{industryId}")]
        public async Task<ActionResult<IEnumerable<NormativaDto>>> GetByIndustry(int industryId, CancellationToken ct)
        {
            var result = await _service.GetByIndustryAsync(industryId, ct);
            return Ok(result);
        }

        [HttpGet("authority/{authorityId}")]
        public async Task<ActionResult<IEnumerable<NormativaDto>>> GetByAuthority(int authorityId, CancellationToken ct)
        {
            var result = await _service.GetByAuthorityAsync(authorityId, ct);
            return Ok(result);
        }

        [HttpGet("year/{year}")]
        public async Task<ActionResult<IEnumerable<NormativaDto>>> GetByYear(int year, CancellationToken ct)
        {
            var result = await _service.GetByYearAsync(year, ct);
            return Ok(result);
        }
    }
}