using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Compliance.Core.Modules.Cumplimiento.GeneralIndustries.Dtos;
using Compliance.Core.Modules.Cumplimiento.GeneralIndustries.Interfaces;

namespace Compliance.Web.Controllers.Cumplimiento.GeneralIndustries
{
	[Authorize]
	[ApiController]
	[Route("api/[controller]")]
	public class GeneralIndustryController : ControllerBase
	{
		private readonly IGeneralIndustryService _service;

		public GeneralIndustryController(IGeneralIndustryService service)
		{
			_service = service;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<GeneralIndustryDto>>> GetAll(CancellationToken ct)
		{
			var result = await _service.GetAllAsync(ct);
			return Ok(result);
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<GeneralIndustryDto>> GetById(int id, CancellationToken ct)
		{
			var result = await _service.GetByIdAsync(id, ct);
			if (result == null) return NotFound();
			return Ok(result);
		}

		[HttpPost]
		public async Task<ActionResult<GeneralIndustryDto>> Create([FromBody] CreateGeneralIndustryDto dto, CancellationToken ct)
		{
			var result = await _service.CreateAsync(dto, ct);
			return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
		}

		[HttpPut("{id}")]
		public async Task<ActionResult<GeneralIndustryDto>> Update(int id, [FromBody] UpdateGeneralIndustryDto dto, CancellationToken ct)
		{
			if (id != dto.Id) return BadRequest();
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