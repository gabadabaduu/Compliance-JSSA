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
        /// GET: api/dsr?companyName=empresaa
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DsrDto>>> GetAll(
            [FromQuery] string? companyName,
            CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(companyName))
            {
                var allResults = await _service.GetAllAsync(ct);
                return Ok(allResults);
            }

            var result = await _service.GetByCompanyAsync(companyName, ct);
            return Ok(result);
        }

        /// <summary>
        /// GET: api/dsr/filter?type=1&stage=Radicado&status=Abierto&companyName=empresaa
        /// </summary>
        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<DsrDto>>> GetFiltered(
            [FromQuery] int? type,
            [FromQuery] string? stage,
            [FromQuery] string? status,
            [FromQuery] string? companyName,
            CancellationToken ct)
        {
            var filters = new DsrFilterDto
            {
                Type = type,
                Stage = stage,
                Status = status,
                CompanyName = companyName
            };

            var result = await _service.GetFilteredAsync(filters, ct);
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

        /// <summary>
        /// GET: api/dsr/next-due
        /// ✅ Obtiene la petición más próxima a vencerse (status = Abierto)
        /// </summary>
        [HttpGet("next-due")]
        public async Task<ActionResult<DsrDto>> GetNextDueSoon(CancellationToken ct)
        {
            var tenant = GetTenantFromUser();
            var result = await _service.GetNextDueSoonAsync(tenant, ct);

            if (result == null)
                return NotFound(new { message = "No hay peticiones pendientes próximas a vencer" });

            return Ok(result);
        }

        /// <summary>
        /// GET: api/dsr/pending
        /// ✅ Obtiene todas las peticiones pendientes (status = Abierto)
        /// </summary>
        [HttpGet("pending")]
        public async Task<ActionResult<IEnumerable<DsrDto>>> GetPending(CancellationToken ct)
        {
            var tenant = GetTenantFromUser();
            var result = await _service.GetPendingAsync(tenant, ct);
            return Ok(result);
        }

        /// <summary>
        /// GET: api/dsr/completed
        /// ✅ Obtiene todas las peticiones completadas (status = Cerrado)
        /// </summary>
        [HttpGet("completed")]
        public async Task<ActionResult<IEnumerable<DsrDto>>> GetCompleted(CancellationToken ct)
        {
            var tenant = GetTenantFromUser();
            var result = await _service.GetCompletedAsync(tenant, ct);
            return Ok(result);
        }

        // ✅ Método auxiliar para extraer tenant
        private string? GetTenantFromUser()
        {
            var userRole = User.FindFirst("user_metadata")?.Value;
            var isSuperAdmin = userRole?.Contains("\"role\":\"superadmin\"") ?? false;

            if (isSuperAdmin) return null;

            var userMetadata = User.FindFirst("user_metadata")?.Value;
            if (userMetadata != null && userMetadata.Contains("\"nombre_empresa\""))
            {
                var startIndex = userMetadata.IndexOf("\"nombre_empresa\":\"") + 18;
                var endIndex = userMetadata.IndexOf("\"", startIndex);
                return userMetadata.Substring(startIndex, endIndex - startIndex);
            }

            return null;
        }
    }
}