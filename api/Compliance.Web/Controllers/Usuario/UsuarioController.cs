using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Compliance.Core.Modules.Usuario.Dtos;
using Compliance.Core.Modules.Usuario.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Compliance.Web.Controllers.Usuario
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioService _service;
        public UsuarioController(IUsuarioService service) => _service = service;

        // GET: api/Usuario/names
        [HttpGet("names")]
        public async Task<ActionResult<IEnumerable<UsuarioNameDto>>> GetNames(CancellationToken ct)
        {
            var items = await _service.GetAllNamesAsync(ct);
            return Ok(items);
        }

        // GET: api/Usuario/{id}
        [HttpGet("{id:long}")]
        public async Task<ActionResult<UsuarioNameDto>> GetById(long id, CancellationToken ct)
        {
            var item = await _service.GetByIdAsync(id, ct);
            if (item == null) return NotFound();
            return Ok(item);
        }
    }
}