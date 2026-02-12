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
    [Route("api/rat/data")]
    public class DataStorageController : ControllerBase
    {
        private readonly IRopaDataStorageService _service;

        public DataStorageController(IRopaDataStorageService service)
        {
            _service = service;
        }

        /// <summary>
        /// GET: api/ropa/datastorage
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RopaDataStorageDto>>> GetAll(CancellationToken ct)
        {
            var result = await _service.GetAllAsync(ct);
            return Ok(result);
        }

        /// <summary>
        /// GET: api/ropa/datastorage/{id}
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<RopaDataStorageDto>> GetById(int id, CancellationToken ct)
        {
            var result = await _service.GetByIdAsync(id, ct);
            if (result == null) return NotFound();
            return Ok(result);
        }

        /// <summary>
        /// POST: api/ropa/datastorage
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<RopaDataStorageDto>> Create([FromBody] CreateRopaDataStorageDto dto, CancellationToken ct)
        {
            var result = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        /// <summary>
        /// PUT: api/ropa/datastorage/{id}
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<RopaDataStorageDto>> Update(int id, [FromBody] UpdateRopaDataStorageDto dto, CancellationToken ct)
        {
            if (id != dto.Id) return BadRequest("ID mismatch");
            var result = await _service.UpdateAsync(dto, ct);
            return Ok(result);
        }

        /// <summary>
        /// DELETE: api/ropa/datastorage/{id}
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