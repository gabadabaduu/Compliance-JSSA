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
    [Route("api/rat/entities")]
    public class EntitiesController : ControllerBase
    {
        private readonly IRopaEntityService _service;

        public EntitiesController(IRopaEntityService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RopaEntityDto>>> GetAll(CancellationToken ct)
        {
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

            var result = await _service.GetAllAsync(tenant, ct);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RopaEntityDto>> GetById(int id, CancellationToken ct)
        {
            var result = await _service.GetByIdAsync(id, ct);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<RopaEntityDto>> Create([FromBody] CreateRopaEntityDto dto, CancellationToken ct)
        {
            var userRole = User.FindFirst("user_metadata")?.Value;
            var isSuperAdmin = userRole?.Contains("\"role\":\"superadmin\"") ?? false;

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

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            dto.CreatedBy = userId;

            var result = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<RopaEntityDto>> Update(int id, [FromBody] UpdateRopaEntityDto dto, CancellationToken ct)
        {
            if (id != dto.Id) return BadRequest("ID mismatch");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            dto.UpdatedBy = userId;

            var result = await _service.UpdateAsync(dto, ct);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id, CancellationToken ct)
        {
            var result = await _service.DeleteAsync(id, ct);
            if (!result) return NotFound();
            return NoContent();
        }
        /// <summary>
        /// GET: api/rat/entities/filter?country=Colombia
        /// ✅ Endpoint para filtros avanzados
        /// </summary>
        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<RopaEntityDto>>> GetFiltered(
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

            if (!string.IsNullOrEmpty(country))
            {
                filtered = filtered.Where(e => e.Country == country);
            }

            return Ok(filtered.ToList());
        }
    }
}