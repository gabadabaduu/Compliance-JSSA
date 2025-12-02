using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.RAT.Dtos;
using Compliance.Core.Modules.RAT.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Compliance.Web.Controllers.RAT
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class RATController : ControllerBase
    {
        private readonly IRatService _service;
        public RATController(IRatService service) => _service = service;

        // GET: api/RAT/names
        [HttpGet("names")]
        public async Task<ActionResult<IEnumerable<RatNameDto>>> GetNames(CancellationToken ct)
        {
            var items = await _service.GetAllNamesAsync(ct);
            return Ok(items);
        }

        // GET: api/RAT/{id}
        [HttpGet("{id:long}")]
        public async Task<ActionResult<RatNameDto>> GetById(long id, CancellationToken ct)
        {
            var item = await _service.GetByIdAsync(id, ct);
            if (item == null) return NotFound();
            return Ok(item);
        }
    }
}