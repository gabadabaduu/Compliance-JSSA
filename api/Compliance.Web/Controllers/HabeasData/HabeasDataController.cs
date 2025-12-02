using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.HabeasData.Dtos;
using Compliance.Core.Modules.HabeasData.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Compliance.Web.Controllers.HabeasData
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class HabeasDataController : ControllerBase
    {
        private readonly IHabeasDataService _service;
        public HabeasDataController(IHabeasDataService service) => _service = service;

        // GET: api/HabeasData/names
        [HttpGet("names")]
        public async Task<ActionResult<IEnumerable<HabeasDataNameDto>>> GetNames(CancellationToken ct)
        {
            var items = await _service.GetAllNamesAsync(ct);
            return Ok(items);
        }

        // GET: api/HabeasData/{id}
        [HttpGet("{id:long}")]
        public async Task<ActionResult<HabeasDataNameDto>> GetById(long id, CancellationToken ct)
        {
            var item = await _service.GetByIdAsync(id, ct);
            if (item == null) return NotFound();
            return Ok(item);
        }
    }
}