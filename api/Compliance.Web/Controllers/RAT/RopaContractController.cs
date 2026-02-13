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
    [Route("api/rat/contracts")]
    public class ContractsController : ControllerBase
    {
        private readonly IRopaContractService _service;

        public ContractsController(IRopaContractService service)
        {
            _service = service;
        }

        /// <summary>
        /// GET: api/rat/contracts
        /// ✅ Filtra por tenant automáticamente
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RopaContractDto>>> GetAll(CancellationToken ct)
        {
            // ✅ Obtener información del usuario autenticado
            var userRole = User.FindFirst("user_metadata")?.Value;
            var isSuperAdmin = userRole?.Contains("\"role\":\"superadmin\"") ?? false;

            string? tenant = null;

            // ✅ Si NO es superadmin, filtrar por su empresa
            if (!isSuperAdmin)
            {
                var userMetadata = User.FindFirst("user_metadata")?.Value;
                if (userMetadata != null && userMetadata.Contains("\"nombre_empresa\""))
                {
                    var startIndex = userMetadata.IndexOf("\"nombre_empresa\":\"") + 18;
                    var endIndex = userMetadata.IndexOf("\"", startIndex);
                    tenant = userMetadata.Substring(startIndex, endIndex - startIndex);
                }
            }

            var result = await _service.GetAllAsync(tenant, ct);
            return Ok(result);
        }

        /// <summary>
        /// GET: api/rat/contracts/{id}
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<RopaContractDto>> GetById(int id, CancellationToken ct)
        {
            var result = await _service.GetByIdAsync(id, ct);
            if (result == null) return NotFound();
            return Ok(result);
        }

        /// <summary>
        /// GET: api/rat/contracts/entity/{entityId}
        /// ✅ También filtra por tenant
        /// </summary>
        [HttpGet("entity/{entityId}")]
        public async Task<ActionResult<IEnumerable<RopaContractDto>>> GetByEntityId(int entityId, CancellationToken ct)
        {
            // ✅ Obtener información del usuario autenticado
            var userRole = User.FindFirst("user_metadata")?.Value;
            var isSuperAdmin = userRole?.Contains("\"role\":\"superadmin\"") ?? false;

            string? tenant = null;

            // ✅ Si NO es superadmin, filtrar por su empresa
            if (!isSuperAdmin)
            {
                var userMetadata = User.FindFirst("user_metadata")?.Value;
                if (userMetadata != null && userMetadata.Contains("\"nombre_empresa\""))
                {
                    var startIndex = userMetadata.IndexOf("\"nombre_empresa\":\"") + 18;
                    var endIndex = userMetadata.IndexOf("\"", startIndex);
                    tenant = userMetadata.Substring(startIndex, endIndex - startIndex);
                }
            }

            var result = await _service.GetByEntityIdAsync(entityId, tenant, ct);
            return Ok(result);
        }

        /// <summary>
        /// POST: api/rat/contracts
        /// ✅ Asigna tenant automáticamente al crear
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<RopaContractDto>> Create([FromBody] CreateRopaContractDto dto, CancellationToken ct)
        {
            // ✅ Obtener tenant del usuario autenticado
            var userRole = User.FindFirst("user_metadata")?.Value;
            var isSuperAdmin = userRole?.Contains("\"role\":\"superadmin\"") ?? false;

            // ✅ Si NO es superadmin, asignar su empresa automáticamente
            if (!isSuperAdmin)
            {
                var userMetadata = User.FindFirst("user_metadata")?.Value;
                if (userMetadata != null && userMetadata.Contains("\"nombre_empresa\""))
                {
                    var startIndex = userMetadata.IndexOf("\"nombre_empresa\":\"") + 18;
                    var endIndex = userMetadata.IndexOf("\"", startIndex);
                    dto.Tenant = userMetadata.Substring(startIndex, endIndex - startIndex);
                }
            }

            // ✅ Obtener el ID del usuario para CreatedBy
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            dto.CreatedBy = userId;

            var result = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        /// <summary>
        /// PUT: api/rat/contracts/{id}
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<RopaContractDto>> Update(int id, [FromBody] UpdateRopaContractDto dto, CancellationToken ct)
        {
            if (id != dto.Id) return BadRequest("ID mismatch");

            // ✅ Obtener el ID del usuario para UpdatedBy
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            dto.UpdatedBy = userId;

            var result = await _service.UpdateAsync(dto, ct);
            return Ok(result);
        }

        /// <summary>
        /// DELETE: api/rat/contracts/{id}
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id, CancellationToken ct)
        {
            var result = await _service.DeleteAsync(id, ct);
            if (!result) return NotFound();
            return NoContent();
        }

        /// <summary>
        /// GET: api/rat/contracts/filter?contractType=Encargado&status=Vigente
        /// ✅ Endpoint para filtros avanzados
        /// </summary>
        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<RopaContractDto>>> GetFiltered(
            [FromQuery] string? contractType,
            [FromQuery] string? status,
            CancellationToken ct)
        {
            // ✅ Obtener tenant del usuario autenticado
            var userRole = User.FindFirst("user_metadata")?.Value;
            var isSuperAdmin = userRole?.Contains("\"role\":\"superadmin\"") ?? false;

            string? tenant = null;

            if (!isSuperAdmin)
            {
                var userMetadata = User.FindFirst("user_metadata")?.Value;
                if (userMetadata != null && userMetadata.Contains("\"nombre_empresa\""))
                {
                    var startIndex = userMetadata.IndexOf("\"nombre_empresa\":\"") + 18;
                    var endIndex = userMetadata.IndexOf("\"", startIndex);
                    tenant = userMetadata.Substring(startIndex, endIndex - startIndex);
                }
            }

            // ✅ Obtener todos los registros (ya filtrados por tenant)
            var allData = await _service.GetAllAsync(tenant, ct);

            // ✅ Aplicar filtros adicionales
            var filtered = allData.AsEnumerable();

            if (!string.IsNullOrEmpty(contractType))
            {
                filtered = filtered.Where(c => c.ContractType == contractType);
            }

            if (!string.IsNullOrEmpty(status))
            {
                filtered = filtered.Where(c => c.Status == status);
            }

            return Ok(filtered.ToList());
        }
    }
}