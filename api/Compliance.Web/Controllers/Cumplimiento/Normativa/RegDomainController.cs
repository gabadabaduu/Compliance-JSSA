using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.RegDomains.Dtos;
using Compliance.Core.Modules.Cumplimiento.RegDomains.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Compliance.Web.Controllers.Cumplimiento.RegDomains
{
    [Authorize]
    [ApiController]
    [Route("api/Normativa/catalog/domains")]
    public class RegDomainController : ControllerBase
    {
        private readonly IRegDomainService _service;

        public RegDomainController(IRegDomainService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RegDomainDto>>> GetAll(CancellationToken ct)
        {
            var result = await _service.GetAllAsync(ct);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RegDomainDto>> GetById(int id, CancellationToken ct)
        {
            var result = await _service.GetByIdAsync(id, ct);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<RegDomainDto>> Create([FromBody] CreateRegDomainDto dto, CancellationToken ct)
        {
            var result = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<RegDomainDto>> Update(int id, [FromBody] UpdateRegDomainDto dto, CancellationToken ct)
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
    }
}