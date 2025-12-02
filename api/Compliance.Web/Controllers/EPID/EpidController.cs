using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.EPID.Interfaces;
using Compliance.Core.Modules.EPID.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Compliance.Web.Controllers.EPID
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class EPIDController : ControllerBase
    {
        private readonly IEpidService _service;
        public EPIDController(IEpidService service) => _service = service;

        // GET: api/EPID/names
        [HttpGet("names")]
        public async Task<ActionResult<IEnumerable<EpidNameDto>>> GetNames(CancellationToken ct)
        {
            var items = await _service.GetAllNamesAsync(ct);
            return Ok(items);
        }

        // GET: api/EPID/{id}
        [HttpGet("{id:long}")]
        public async Task<ActionResult<EpidNameDto>> GetById(long id, CancellationToken ct)
        {
            var item = await _service.GetByIdAsync(id, ct);
            if (item == null) return NotFound();
            return Ok(item);
        }
    }
}