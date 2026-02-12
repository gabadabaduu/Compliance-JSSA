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
    [Route("api/rat/contracts")]
    public class ContractsController : ControllerBase
    {
        private readonly IRopaContractService _service;

        public ContractsController(IRopaContractService service)
        {
            _service = service;
        }

        /// <summary>
        /// GET: api/ropa/contracts
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RopaContractDto>>> GetAll(CancellationToken ct)
        {
            var result = await _service.GetAllAsync(ct);
            return Ok(result);
        }

        /// <summary>
        /// GET: api/ropa/contracts/{id}
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<RopaContractDto>> GetById(int id, CancellationToken ct)
        {
            var result = await _service.GetByIdAsync(id, ct);
            if (result == null) return NotFound();
            return Ok(result);
        }

        /// <summary>
        /// GET: api/ropa/contracts/entity/{entityId}
        /// </summary>
        [HttpGet("entity/{entityId}")]
        public async Task<ActionResult<IEnumerable<RopaContractDto>>> GetByEntityId(int entityId, CancellationToken ct)
        {
            var result = await _service.GetByEntityIdAsync(entityId, ct);
            return Ok(result);
        }

        /// <summary>
        /// POST: api/ropa/contracts
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<RopaContractDto>> Create([FromBody] CreateRopaContractDto dto, CancellationToken ct)
        {
            var result = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        /// <summary>
        /// PUT: api/ropa/contracts/{id}
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<RopaContractDto>> Update(int id, [FromBody] UpdateRopaContractDto dto, CancellationToken ct)
        {
            if (id != dto.Id) return BadRequest("ID mismatch");
            var result = await _service.UpdateAsync(dto, ct);
            return Ok(result);
        }

        /// <summary>
        /// DELETE: api/ropa/contracts/{id}
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