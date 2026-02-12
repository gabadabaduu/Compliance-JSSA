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
    [Route("api/rat/departments")]
    public class DepartmentsController : ControllerBase
    {
        private readonly IRopaDepartmentService _service;

        public DepartmentsController(IRopaDepartmentService service)
        {
            _service = service;
        }

        /// <summary>
        /// GET: api/ropa/departments
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RopaDepartmentDto>>> GetAll(CancellationToken ct)
        {
            var result = await _service.GetAllAsync(ct);
            return Ok(result);
        }

        /// <summary>
        /// GET: api/ropa/departments/{id}
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<RopaDepartmentDto>> GetById(int id, CancellationToken ct)
        {
            var result = await _service.GetByIdAsync(id, ct);
            if (result == null) return NotFound();
            return Ok(result);
        }

        /// <summary>
        /// POST: api/ropa/departments
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<RopaDepartmentDto>> Create([FromBody] CreateRopaDepartmentDto dto, CancellationToken ct)
        {
            var result = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        /// <summary>
        /// PUT: api/ropa/departments/{id}
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<RopaDepartmentDto>> Update(int id, [FromBody] UpdateRopaDepartmentDto dto, CancellationToken ct)
        {
            if (id != dto.Id) return BadRequest("ID mismatch");
            var result = await _service.UpdateAsync(dto, ct);
            return Ok(result);
        }

        /// <summary>
        /// DELETE: api/ropa/departments/{id}
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