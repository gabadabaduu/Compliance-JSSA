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
                    CreatedAt = u.CreatedAt
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

            // Solo leer Role para verificar permisos
            var currentUserRole = await _context.Users
                .Where(u => u.Id == Guid.Parse(userId))
                .Select(u => u.Role)
                .FirstOrDefaultAsync();

            if (currentUserRole == null)
            {
                return Unauthorized(new { message = "Usuario no encontrado" });
            }

            // Verificar que sea admin o superadmin
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
                    CreatedAt = u.CreatedAt
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

            // Solo leer campos necesarios
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

            // No permitir eliminar superadmins
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