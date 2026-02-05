using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.DSR.Dtos;
using Compliance.Core.Modules.DSR.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Compliance.Web.Controllers.DSR
{
    [Authorize]
    [ApiController]
    [Route("api/dsr/statuses")]
    public class DsrStatusController : ControllerBase
    {
        private readonly IDsrStatusService _service;

        public DsrStatusController(IDsrStatusService service)
        {
            _service = service;
        }

        /// <summary>
        /// GET: api/dsr/statuses
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DsrStatusDto>>> GetAll(CancellationToken ct)
        {
            var result = await _service.GetAllAsync(ct);
            return Ok(result);
        }

        /// <summary>
        /// GET: api/dsr/statuses/{id}
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<DsrStatusDto>> GetById(int id, CancellationToken ct)
        {
            var result = await _service.GetByIdAsync(id, ct);
            if (result == null) return NotFound();
            return Ok(result);
        }

        /// <summary>
        /// POST: api/dsr/statuses
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<DsrStatusDto>> Create([FromBody] CreateDsrStatusDto dto, CancellationToken ct)
        {
            var result = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        /// <summary>
        /// PUT: api/dsr/statuses/{id}
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<DsrStatusDto>> Update(int id, [FromBody] UpdateDsrStatusDto dto, CancellationToken ct)
        {
            if (id != dto.Id) return BadRequest("ID mismatch");
            var result = await _service.UpdateAsync(dto, ct);
            return Ok(result);
        }

        /// <summary>
        /// DELETE: api/dsr/statuses/{id}
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