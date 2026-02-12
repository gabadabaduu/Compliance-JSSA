using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.ROPA.Dtos;
using Compliance.Core.Modules.ROPA.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Compliance.Web.Controllers.ROPA
{
    [Authorize]
    [ApiController]
    [Route("api/rat/entities")]
    public class EntitiesController : ControllerBase
    {
        private readonly IRopaEntityService _service;

        public EntitiesController(IRopaEntityService service)
        {
            _service = service;
        }

        /// <summary>
        /// GET: api/ropa/entities
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RopaEntityDto>>> GetAll(CancellationToken ct)
        {
            var result = await _service.GetAllAsync(ct);
            return Ok(result);
        }

        /// <summary>
        /// GET: api/ropa/entities/{id}
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<RopaEntityDto>> GetById(int id, CancellationToken ct)
        {
            var result = await _service.GetByIdAsync(id, ct);
            if (result == null) return NotFound();
            return Ok(result);
        }

        /// <summary>
        /// POST: api/ropa/entities
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<RopaEntityDto>> Create([FromBody] CreateRopaEntityDto dto, CancellationToken ct)
        {
            var result = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        /// <summary>
        /// PUT: api/ropa/entities/{id}
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<RopaEntityDto>> Update(int id, [FromBody] UpdateRopaEntityDto dto, CancellationToken ct)
        {
            if (id != dto.Id) return BadRequest("ID mismatch");
            var result = await _service.UpdateAsync(dto, ct);
            return Ok(result);
        }

        /// <summary>
        /// DELETE: api/ropa/entities/{id}
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id, CancellationToken ct)
        {
            var result = await _service.DeleteAsync(id, ct);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}