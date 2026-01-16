using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Cumplimiento.RegAuthorities.Dtos;
using Compliance.Core.Modules.Cumplimiento.RegAuthorities.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Compliance.Web.Controllers.Cumplimiento.RegAuthorities
{
    [Authorize]
    [ApiController]
    [Route("api/Normativa/catalog/authorities")]
    public class RegAuthorityController : ControllerBase
    {
        private readonly IRegAuthorityService _service;

        public RegAuthorityController(IRegAuthorityService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RegAuthorityDto>>> GetAll(CancellationToken ct)
        {
            var result = await _service.GetAllAsync(ct);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RegAuthorityDto>> GetById(int id, CancellationToken ct)
        {
            var result = await _service.GetByIdAsync(id, ct);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<RegAuthorityDto>> Create([FromBody] CreateRegAuthorityDto dto, CancellationToken ct)
        {
            var result = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<RegAuthorityDto>> Update(int id, [FromBody] UpdateRegAuthorityDto dto, CancellationToken ct)
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