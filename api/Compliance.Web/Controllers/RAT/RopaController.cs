using System.Collections.Generic;
using System.Linq;
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
    [Route("api/rat/table")]
    public class RopaController : ControllerBase
    {
        private readonly IRopaService _service;

        public RopaController(IRopaService service)
        {
            _service = service;
        }

        /// <summary>
        /// GET: api/rat/ropa
        /// ✅ Filtra por tenant automáticamente
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RopaDto>>> GetAll(CancellationToken ct)
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

        /// <summary>
        /// ✅ IMPORTANTE: Este método debe ir ANTES de GetById
        /// GET: api/rat/ropa/filter?processOwner=1&dataCategories=Sensible&dataShared=Sí
        /// </summary>
        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<RopaDto>>> GetFiltered(
            [FromQuery] int? processOwner,
            [FromQuery] string? dataCategories,
            [FromQuery] string? dataShared,
            CancellationToken ct)
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

            var allData = await _service.GetAllAsync(tenant, ct);
            var filtered = allData.AsEnumerable();

            if (processOwner.HasValue)
            {
                filtered = filtered.Where(r => r.ProcessOwner == processOwner.Value);
            }

            if (!string.IsNullOrEmpty(dataCategories))
            {
                filtered = filtered.Where(r => r.DataCategories == dataCategories);
            }

            if (!string.IsNullOrEmpty(dataShared))
            {
                filtered = filtered.Where(r => r.DataShared == dataShared);
            }

            return Ok(filtered.ToList());
        }

        /// <summary>
        /// GET: api/rat/ropa/{id}
        /// ✅ Este método debe ir DESPUÉS de filter
        /// </summary>
        [HttpGet("{id:int}")] // ✅ Añadido :int para evitar ambigüedad
        public async Task<ActionResult<RopaDto>> GetById(int id, CancellationToken ct)
        {
            var result = await _service.GetByIdAsync(id, ct);
            if (result == null) return NotFound();
            return Ok(result);
        }

        /// <summary>
        /// POST: api/rat/ropa
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<RopaDto>> Create([FromBody] CreateRopaDto dto, CancellationToken ct)
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

        /// <summary>
        /// PUT: api/rat/ropa/{id}
        /// </summary>
        [HttpPut("{id:int}")]
        public async Task<ActionResult<RopaDto>> Update(int id, [FromBody] UpdateRopaDto dto, CancellationToken ct)
        {
            if (id != dto.Id) return BadRequest("ID mismatch");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            dto.UpdatedBy = userId;

            var result = await _service.UpdateAsync(dto, ct);
            return Ok(result);
        }

        /// <summary>
        /// DELETE: api/rat/ropa/{id}
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> Delete(int id, CancellationToken ct)
        {
            var result = await _service.DeleteAsync(id, ct);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}