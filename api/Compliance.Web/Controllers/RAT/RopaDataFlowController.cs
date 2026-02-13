using System.Collections.Generic;
using System.Security.Claims;
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
    [Route("api/rat/dataflow")]
    public class DataFlowController : ControllerBase
    {
        private readonly IRopaDataFlowService _service;

        public DataFlowController(IRopaDataFlowService service)
        {
            _service = service;
        }

        /// <summary>
        /// GET: api/rat/dataflow
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RopaDataFlowDto>>> GetAll(CancellationToken ct)
        {
            var result = await _service.GetAllAsync(ct);
            return Ok(result);
        }

        /// <summary>
        /// GET: api/rat/dataflow/{id}
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<RopaDataFlowDto>> GetById(int id, CancellationToken ct)
        {
            var result = await _service.GetByIdAsync(id, ct);
            if (result == null) return NotFound();
            return Ok(result);
        }

        /// <summary>
        /// GET: api/rat/dataflow/entity/{entityId}
        /// Obtener flujos de datos por entidad
        /// </summary>
        [HttpGet("entity/{entityId}")]
        public async Task<ActionResult<IEnumerable<RopaDataFlowDto>>> GetByEntityId(int entityId, CancellationToken ct)
        {
            var result = await _service.GetByEntityIdAsync(entityId, ct);
            return Ok(result);
        }

        /// <summary>
        /// GET: api/rat/dataflow/activity/{activityId}
        /// Obtener flujos de datos por actividad de procesamiento
        /// </summary>
        [HttpGet("activity/{activityId}")]
        public async Task<ActionResult<IEnumerable<RopaDataFlowDto>>> GetByProcessingActivityId(int activityId, CancellationToken ct)
        {
            var result = await _service.GetByProcessingActivityIdAsync(activityId, ct);
            return Ok(result);
        }

        /// <summary>
        /// POST: api/rat/dataflow
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<RopaDataFlowDto>> Create([FromBody] CreateRopaDataFlowDto dto, CancellationToken ct)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            dto.CreatedBy = userId;

            var result = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        /// <summary>
        /// PUT: api/rat/dataflow/{id}
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<RopaDataFlowDto>> Update(int id, [FromBody] UpdateRopaDataFlowDto dto, CancellationToken ct)
        {
            if (id != dto.Id) return BadRequest("ID mismatch");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            dto.UpdatedBy = userId;

            var result = await _service.UpdateAsync(dto, ct);
            return Ok(result);
        }

        /// <summary>
        /// DELETE: api/rat/dataflow/{id}
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