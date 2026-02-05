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
    [Route("api/[controller]")]
    public class DsrController : ControllerBase
    {
        private readonly IDsrService _service;

        public DsrController(IDsrService service)
        {
            _service = service;
        }

        /// <summary>
        /// GET: api/dsr
        /// GET: api/dsr?companyName=EmpresaXYZ
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DsrDto>>> GetAll(
            [FromQuery] string? companyName, // ✅ NUEVO PARÁMETRO
            CancellationToken ct)
        {
            // Si no se envía companyName, devolver todas
            if (string.IsNullOrWhiteSpace(companyName))
            {
                var allResults = await _service.GetAllAsync(ct);
                return Ok(allResults);
            }

            // Filtrar por empresa
            var result = await _service.GetByCompanyAsync(companyName, ct);
            return Ok(result);
        }

        /// <summary>
        /// GET: api/dsr/{id}
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<DsrDto>> GetById(long id, CancellationToken ct)
        {
            var result = await _service.GetByIdAsync(id, ct);
            if (result == null) return NotFound();
            return Ok(result);
        }

        /// <summary>
        /// GET: api/dsr/case/{caseId}
        /// </summary>
        [HttpGet("case/{caseId}")]
        public async Task<ActionResult<IEnumerable<DsrDto>>> GetByCaseId(string caseId, CancellationToken ct)
        {
            var result = await _service.GetByCaseIdAsync(caseId, ct);
            return Ok(result);
        }

        /// <summary>
        /// GET: api/dsr/type/{typeId}
        /// </summary>
        [HttpGet("type/{typeId}")]
        public async Task<ActionResult<IEnumerable<DsrDto>>> GetByType(int typeId, CancellationToken ct)
        {
            var result = await _service.GetByTypeAsync(typeId, ct);
            return Ok(result);
        }

        /// <summary>
        /// POST: api/dsr
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<DsrDto>> Create([FromBody] CreateDsrDto dto, CancellationToken ct)
        {
            var result = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        /// <summary>
        /// PUT: api/dsr/{id}
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<DsrDto>> Update(long id, [FromBody] UpdateDsrDto dto, CancellationToken ct)
        {
            if (id != dto.Id) return BadRequest("ID mismatch");
            var result = await _service.UpdateAsync(dto, ct);
            return Ok(result);
        }

        /// <summary>
        /// DELETE: api/dsr/{id}
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(long id, CancellationToken ct)
        {
            var result = await _service.DeleteAsync(id, ct);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}