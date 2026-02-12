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
    [Route("api/rat/contact-channels")]
    public class ContactChannelsController : ControllerBase
    {
        private readonly IContactChannelService _service;

        public ContactChannelsController(IContactChannelService service)
        {
            _service = service;
        }

        /// <summary>
        /// GET: api/ropa/contactchannels
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ContactChannelDto>>> GetAll(CancellationToken ct)
        {
            var result = await _service.GetAllAsync(ct);
            return Ok(result);
        }

        /// <summary>
        /// GET: api/ropa/contactchannels/{id}
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ContactChannelDto>> GetById(int id, CancellationToken ct)
        {
            var result = await _service.GetByIdAsync(id, ct);
            if (result == null) return NotFound();
            return Ok(result);
        }

        /// <summary>
        /// POST: api/ropa/contactchannels
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ContactChannelDto>> Create([FromBody] CreateContactChannelDto dto, CancellationToken ct)
        {
            var result = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        /// <summary>
        /// PUT: api/ropa/contactchannels/{id}
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<ContactChannelDto>> Update(int id, [FromBody] UpdateContactChannelDto dto, CancellationToken ct)
        {
            if (id != dto.Id) return BadRequest("ID mismatch");
            var result = await _service.UpdateAsync(dto, ct);
            return Ok(result);
        }

        /// <summary>
        /// DELETE: api/ropa/contactchannels/{id}
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