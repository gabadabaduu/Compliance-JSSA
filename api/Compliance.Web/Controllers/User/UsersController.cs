using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Compliance.Infrastructure.Data;
using Compliance.Web.DTOs.User;

namespace Compliance.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly ILogger<UsersController> _logger;
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context, ILogger<UsersController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// GET: api/users/me - Obtener información del usuario actual
    /// </summary>
    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        try
        {
            var userId = User.FindFirst("sub")?.Value;

            _logger.LogInformation("Usuario intentando obtener su info: {UserId}", userId);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Usuario no autenticado" });
            }

            var user = await _context.Users
                .Where(u => u.Id == Guid.Parse(userId))
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Email = u.Email ?? string.Empty,
                    FullName = u.FullName,
                    Role = u.Role,
                    NombreEmpresa = u.NombreEmpresa,
                    CreatedAt = u.CreatedAt,
                    AccessDashboard = u.AccessDashboard,
                    AccessEpid = u.AccessEpid,
                    AccessRat = u.AccessRat,
                    AccessNormograma = u.AccessNormograma,
                    AccessHabeasdata = u.AccessHabeasdata,
                    AccessMatrizriesgo = u.AccessMatrizriesgo,
                    AccessAjustes = u.AccessAjustes,
                    AccessUsuario = u.AccessUsuario
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                _logger.LogWarning("Usuario no encontrado en BD: {UserId}", userId);
                return NotFound(new { message = "Usuario no encontrado" });
            }

            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener usuario actual");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// GET: api/users - Obtener todos los usuarios (solo admin/superadmin)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<UserDto>>> GetAllUsers()
    {
        try
        {
            var userId = User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Usuario no autenticado" });
            }

            var currentUserRole = await _context.Users
                .Where(u => u.Id == Guid.Parse(userId))
                .Select(u => u.Role)
                .FirstOrDefaultAsync();

            if (currentUserRole == null)
            {
                return Unauthorized(new { message = "Usuario no encontrado" });
            }

            if (currentUserRole != "admin" && currentUserRole != "superadmin")
            {
                return Forbid();
            }

            var users = await _context.Users
                .OrderByDescending(u => u.CreatedAt)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Email = u.Email ?? string.Empty,
                    FullName = u.FullName,
                    Role = u.Role,
                    NombreEmpresa = u.NombreEmpresa,
                    CreatedAt = u.CreatedAt,
                    AccessDashboard = u.AccessDashboard,
                    AccessEpid = u.AccessEpid,
                    AccessRat = u.AccessRat,
                    AccessNormograma = u.AccessNormograma,
                    AccessHabeasdata = u.AccessHabeasdata,
                    AccessMatrizriesgo = u.AccessMatrizriesgo,
                    AccessAjustes = u.AccessAjustes,
                    AccessUsuario = u.AccessUsuario
                })
                .ToListAsync();

            return Ok(users);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener usuarios");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// GET: api/users/{id} - Obtener un usuario por ID (solo admin/superadmin)
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUserById(Guid id)
    {
        try
        {
            var userId = User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Usuario no autenticado" });
            }

            var currentUserRole = await _context.Users
                .Where(u => u.Id == Guid.Parse(userId))
                .Select(u => u.Role)
                .FirstOrDefaultAsync();

            if (currentUserRole == null)
            {
                return Unauthorized(new { message = "Usuario no encontrado" });
            }

            // Permitir a cualquier usuario ver su propia información
            if (Guid.Parse(userId) != id && currentUserRole != "admin" && currentUserRole != "superadmin")
            {
                return Forbid();
            }

            var user = await _context.Users
                .Where(u => u.Id == id)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Email = u.Email ?? string.Empty,
                    FullName = u.FullName,
                    Role = u.Role,
                    NombreEmpresa = u.NombreEmpresa,
                    CreatedAt = u.CreatedAt,
                    AccessDashboard = u.AccessDashboard,
                    AccessEpid = u.AccessEpid,
                    AccessRat = u.AccessRat,
                    AccessNormograma = u.AccessNormograma,
                    AccessHabeasdata = u.AccessHabeasdata,
                    AccessMatrizriesgo = u.AccessMatrizriesgo,
                    AccessAjustes = u.AccessAjustes,
                    AccessUsuario = u.AccessUsuario
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound(new { message = "Usuario no encontrado" });
            }

            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener usuario por ID");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// PUT: api/users/{id} - Actualizar información de usuario (solo admin/superadmin)
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<UserDto>> UpdateUser(Guid id, [FromBody] UpdateUserDto updateDto)
    {
        try
        {
            var userId = User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Usuario no autenticado" });
            }

            var currentUser = await _context.Users
                .Where(u => u.Id == Guid.Parse(userId))
                .Select(u => new { u.Role })
                .FirstOrDefaultAsync();

            if (currentUser == null)
            {
                return Unauthorized(new { message = "Usuario no encontrado" });
            }

            // Solo admin/superadmin pueden actualizar otros usuarios
            // Un usuario puede actualizar su propio nombre y empresa
            var isSelf = Guid.Parse(userId) == id;
            var isAdmin = currentUser.Role == "admin" || currentUser.Role == "superadmin";

            if (!isSelf && !isAdmin)
            {
                return Forbid();
            }

            var userToUpdate = await _context.Users.FindAsync(id);

            if (userToUpdate == null)
            {
                return NotFound(new { message = "Usuario no encontrado" });
            }

            // Actualizar campos permitidos
            if (!string.IsNullOrEmpty(updateDto.FullName))
            {
                userToUpdate.FullName = updateDto.FullName;
            }

            if (!string.IsNullOrEmpty(updateDto.NombreEmpresa))
            {
                userToUpdate.NombreEmpresa = updateDto.NombreEmpresa;
            }

            // Solo admin/superadmin pueden cambiar el rol
            if (isAdmin && !string.IsNullOrEmpty(updateDto.Role))
            {
                // Superadmin no puede ser degradado por un admin
                if (userToUpdate.Role == "superadmin" && currentUser.Role != "superadmin")
                {
                    return BadRequest(new { message = "No tienes permisos para cambiar el rol de un superadmin" });
                }
                userToUpdate.Role = updateDto.Role;
            }

            userToUpdate.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Usuario actualizado: {UserId}", id);

            return Ok(new UserDto
            {
                Id = userToUpdate.Id,
                Email = userToUpdate.Email ?? string.Empty,
                FullName = userToUpdate.FullName,
                Role = userToUpdate.Role,
                NombreEmpresa = userToUpdate.NombreEmpresa,
                CreatedAt = userToUpdate.CreatedAt,
                AccessDashboard = userToUpdate.AccessDashboard,
                AccessEpid = userToUpdate.AccessEpid,
                AccessRat = userToUpdate.AccessRat,
                AccessNormograma = userToUpdate.AccessNormograma,
                AccessHabeasdata = userToUpdate.AccessHabeasdata,
                AccessMatrizriesgo = userToUpdate.AccessMatrizriesgo,
                AccessAjustes = userToUpdate.AccessAjustes,
                AccessUsuario = userToUpdate.AccessUsuario
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar usuario");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// PUT: api/users/{id}/permissions - Actualizar permisos de usuario (solo admin/superadmin)
    /// </summary>
    [HttpPut("{id}/permissions")]
    public async Task<ActionResult<UserDto>> UpdateUserPermissions(Guid id, [FromBody] UpdateUserPermissionsDto permissionsDto)
    {
        try
        {
            var userId = User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Usuario no autenticado" });
            }

            var currentUserRole = await _context.Users
                .Where(u => u.Id == Guid.Parse(userId))
                .Select(u => u.Role)
                .FirstOrDefaultAsync();

            if (currentUserRole == null)
            {
                return Unauthorized(new { message = "Usuario no encontrado" });
            }

            if (currentUserRole != "admin" && currentUserRole != "superadmin")
            {
                return Forbid();
            }

            var userToUpdate = await _context.Users.FindAsync(id);

            if (userToUpdate == null)
            {
                return NotFound(new { message = "Usuario no encontrado" });
            }

            // No permitir modificar permisos de superadmin si no eres superadmin
            if (userToUpdate.Role == "superadmin" && currentUserRole != "superadmin")
            {
                return BadRequest(new { message = "No tienes permisos para modificar los permisos de un superadmin" });
            }

            // Actualizar permisos
            userToUpdate.AccessDashboard = permissionsDto.AccessDashboard;
            userToUpdate.AccessEpid = permissionsDto.AccessEpid;
            userToUpdate.AccessRat = permissionsDto.AccessRat;
            userToUpdate.AccessNormograma = permissionsDto.AccessNormograma;
            userToUpdate.AccessHabeasdata = permissionsDto.AccessHabeasdata;
            userToUpdate.AccessMatrizriesgo = permissionsDto.AccessMatrizriesgo;
            userToUpdate.AccessAjustes = permissionsDto.AccessAjustes;
            userToUpdate.AccessUsuario = permissionsDto.AccessUsuario;
            userToUpdate.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Permisos actualizados para usuario: {UserId}", id);

            return Ok(new UserDto
            {
                Id = userToUpdate.Id,
                Email = userToUpdate.Email ?? string.Empty,
                FullName = userToUpdate.FullName,
                Role = userToUpdate.Role,
                NombreEmpresa = userToUpdate.NombreEmpresa,
                CreatedAt = userToUpdate.CreatedAt,
                AccessDashboard = userToUpdate.AccessDashboard,
                AccessEpid = userToUpdate.AccessEpid,
                AccessRat = userToUpdate.AccessRat,
                AccessNormograma = userToUpdate.AccessNormograma,
                AccessHabeasdata = userToUpdate.AccessHabeasdata,
                AccessMatrizriesgo = userToUpdate.AccessMatrizriesgo,
                AccessAjustes = userToUpdate.AccessAjustes,
                AccessUsuario = userToUpdate.AccessUsuario
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar permisos de usuario");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// DELETE: api/users/{id} - Eliminar un usuario (solo superadmin)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        try
        {
            var userId = User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Usuario no autenticado" });
            }

            var currentUser = await _context.Users
                .Where(u => u.Id == Guid.Parse(userId))
                .Select(u => new { u.Role, u.Email })
                .FirstOrDefaultAsync();

            if (currentUser == null || currentUser.Role != "superadmin")
            {
                return Forbid();
            }

            var userToDelete = await _context.Users.FindAsync(id);

            if (userToDelete == null)
            {
                return NotFound(new { message = "Usuario no encontrado" });
            }

            if (userToDelete.Role == "superadmin")
            {
                return BadRequest(new { message = "No se puede eliminar un superadmin" });
            }

            _context.Users.Remove(userToDelete);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Usuario eliminado: {Email} por {AdminEmail}",
                userToDelete.Email, currentUser.Email);

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al eliminar usuario");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }
}