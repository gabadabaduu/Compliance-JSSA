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
    [Route("api/rat/data")]
    public class DataStorageController : ControllerBase
    {
        private readonly IRopaDataStorageService _service;

        public DataStorageController(IRopaDataStorageService service)
        {
            _service = service;
        }

        /// <summary>
        /// GET: api/rat/data
        /// ✅ Filtra por tenant automáticamente
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RopaDataStorageDto>>> GetAll(CancellationToken ct)
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
        /// GET: api/rat/data/{id}
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<RopaDataStorageDto>> GetById(int id, CancellationToken ct)
        {
            var result = await _service.GetByIdAsync(id, ct);
            if (result == null) return NotFound();
            return Ok(result);
        }

        /// <summary>
        /// POST: api/rat/data
        /// ✅ Asigna tenant automáticamente al crear
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<RopaDataStorageDto>> Create([FromBody] CreateRopaDataStorageDto dto, CancellationToken ct)
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
        /// PUT: api/rat/data/{id}
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<RopaDataStorageDto>> Update(int id, [FromBody] UpdateRopaDataStorageDto dto, CancellationToken ct)
        {
            if (id != dto.Id) return BadRequest("ID mismatch");

            // ✅ Obtener el ID del usuario para UpdatedBy
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            dto.UpdatedBy = userId;

            var result = await _service.UpdateAsync(dto, ct);
            return Ok(result);
        }

        /// <summary>
        /// DELETE: api/rat/data/{id}
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id, CancellationToken ct)
        {
            var result = await _service.DeleteAsync(id, ct);
            if (!result) return NotFound();
            return NoContent();
        }
        /// <summary>
        /// GET: api/rat/data/filter?processingMode=Manual&country=Colombia
        /// ✅ Endpoint para filtros avanzados
        /// </summary>
        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<RopaDataStorageDto>>> GetFiltered(
            [FromQuery] string? processingMode,
            [FromQuery] string? country,
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

            if (!string.IsNullOrEmpty(processingMode))
            {
                filtered = filtered.Where(d => d.ProcessingMode == processingMode);
            }

            if (!string.IsNullOrEmpty(country))
            {
                filtered = filtered.Where(d => d.Country == country);
            }

            return Ok(filtered.ToList());
        }
    }
}