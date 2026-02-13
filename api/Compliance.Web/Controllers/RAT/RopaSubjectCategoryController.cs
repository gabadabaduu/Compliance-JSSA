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
    [Route("api/rat/subjectcategories")]
    public class SubjectCategoriesController : ControllerBase
    {
        private readonly IRopaSubjectCategoryService _service;

        public SubjectCategoriesController(IRopaSubjectCategoryService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RopaSubjectCategoryDto>>> GetAll(CancellationToken ct)
        {
            var result = await _service.GetAllAsync(ct);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RopaSubjectCategoryDto>> GetById(int id, CancellationToken ct)
        {
            var result = await _service.GetByIdAsync(id, ct);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<RopaSubjectCategoryDto>> Create([FromBody] CreateRopaSubjectCategoryDto dto, CancellationToken ct)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            dto.CreatedBy = userId;

            var result = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<RopaSubjectCategoryDto>> Update(int id, [FromBody] UpdateRopaSubjectCategoryDto dto, CancellationToken ct)
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
    }
}