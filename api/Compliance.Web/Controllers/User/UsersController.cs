using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Compliance.Infrastructure.Data;
using Compliance.Web.DTOs.User;
using Compliance.Web.Hubs;

namespace Compliance.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly ILogger<UsersController> _logger;
    private readonly AppDbContext _context;
    private readonly IHubContext<NotificationHub> _hubContext;

    public UsersController(
        AppDbContext context,
        ILogger<UsersController> logger,
        IHubContext<NotificationHub> hubContext)
    {
        _context = context;
        _logger = logger;
        _hubContext = hubContext;
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
    /// GET: api/users - Obtener todos los usuarios (solo admin/superadmin de la MISMA empresa)
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

            // Obtener rol Y empresa del usuario actual
            var currentUser = await _context.Users
                .Where(u => u.Id == Guid.Parse(userId))
                .Select(u => new { u.Role, u.NombreEmpresa })
                .FirstOrDefaultAsync();

            if (currentUser == null)
            {
                return Unauthorized(new { message = "Usuario no encontrado" });
            }

            if (currentUser.Role != "admin" && currentUser.Role != "superadmin")
            {
                return Forbid();
            }

            // Filtrar usuarios según rol
            var usersQuery = _context.Users.AsQueryable();

            // Superadmin ve todos, admin solo ve los de su empresa
            if (currentUser.Role == "admin" && !string.IsNullOrEmpty(currentUser.NombreEmpresa))
            {
                usersQuery = usersQuery.Where(u => u.NombreEmpresa == currentUser.NombreEmpresa);
            }

            var users = await usersQuery
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

            var currentUser = await _context.Users
                .Where(u => u.Id == Guid.Parse(userId))
                .Select(u => new { u.Role, u.NombreEmpresa })
                .FirstOrDefaultAsync();

            if (currentUser == null)
            {
                return Unauthorized(new { message = "Usuario no encontrado" });
            }

            // Permitir a cualquier usuario ver su propia información
            if (Guid.Parse(userId) != id && currentUser.Role != "admin" && currentUser.Role != "superadmin")
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

            // Admin solo puede ver usuarios de su empresa
            if (currentUser.Role == "admin" && user.NombreEmpresa != currentUser.NombreEmpresa)
            {
                return Forbid();
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
                .Select(u => new { u.Role, u.NombreEmpresa })
                .FirstOrDefaultAsync();

            if (currentUser == null)
            {
                return Unauthorized(new { message = "Usuario no encontrado" });
            }

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

            // Admin solo puede modificar usuarios de su empresa
            if (currentUser.Role == "admin" && userToUpdate.NombreEmpresa != currentUser.NombreEmpresa)
            {
                return Forbid();
            }

            if (!string.IsNullOrEmpty(updateDto.FullName))
            {
                userToUpdate.FullName = updateDto.FullName;
            }

            if (!string.IsNullOrEmpty(updateDto.NombreEmpresa))
            {
                userToUpdate.NombreEmpresa = updateDto.NombreEmpresa;
            }

            if (isAdmin && !string.IsNullOrEmpty(updateDto.Role))
            {
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
    /// PUT: api/users/{id}/permissions - Actualizar permisos de usuario (solo admin/superadmin de la MISMA empresa)
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

            // Obtener rol Y empresa del usuario actual
            var currentUser = await _context.Users
                .Where(u => u.Id == Guid.Parse(userId))
                .Select(u => new { u.Role, u.NombreEmpresa })
                .FirstOrDefaultAsync();

            if (currentUser == null)
            {
                return Unauthorized(new { message = "Usuario no encontrado" });
            }

            if (currentUser.Role != "admin" && currentUser.Role != "superadmin")
            {
                return Forbid();
            }

            var userToUpdate = await _context.Users.FindAsync(id);

            if (userToUpdate == null)
            {
                return NotFound(new { message = "Usuario no encontrado" });
            }

            // Admin solo puede modificar usuarios de SU empresa
            if (currentUser.Role == "admin")
            {
                if (userToUpdate.NombreEmpresa != currentUser.NombreEmpresa)
                {
                    return Forbid();
                }
            }

            // No permitir modificar permisos de superadmin si no eres superadmin
            if (userToUpdate.Role == "superadmin" && currentUser.Role != "superadmin")
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

            // ✅ NUEVO: Notificar al usuario afectado via SignalR
            await _hubContext.Clients.Group($"user_{id}").SendAsync("PermissionsChanged", new
            {
                userId = id,
                message = "Tus permisos han sido actualizados",
                timestamp = DateTime.UtcNow
            });

            _logger.LogInformation("Notificación SignalR enviada al usuario: {UserId}", id);

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
    /// DELETE: api/users/{id} - Eliminar un usuario (solo admin/superadmin de la MISMA empresa)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        try
        {
            var userId = User.FindFirst("sub")?.Value;

            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(new { message = "Usuario no autenticado" });
            }

            // Paso 1: Cargar el usuario solicitante
            var currentUser = await _context.Users
                .Where(u => u.Id == Guid.Parse(userId))
                .Select(u => new { u.Role, u.NombreEmpresa })
                .FirstOrDefaultAsync();

            if (currentUser == null)
            {
                return Unauthorized(new { message = "Usuario no encontrado" });
            }

            // Validar que sea admin o superadmin
            if (currentUser.Role != "admin" && currentUser.Role != "superadmin")
            {
                return Forbid();
            }

            // Paso 2: Buscar el usuario a eliminar en la base de datos local
            var userToDelete = await _context.Users.FindAsync(id);
            if (userToDelete == null)
            {
                return NotFound(new { message = "Usuario no encontrado" });
            }

            // Paso 3: Verificar permisos según el rol
            if (currentUser.Role == "admin" &&
                (userToDelete.NombreEmpresa != currentUser.NombreEmpresa || userToDelete.Role == "superadmin"))
            {
                return Forbid();
            }

            if (currentUser.Role == "admin" && userToDelete.Role == "admin")
            {
                return BadRequest(new { message = "No puedes eliminar a otro administrador" });
            }

            try
            {
                // Paso 5: Eliminar usuario de la base de datos local (Primero elimina localmente)
                _context.Users.Remove(userToDelete);
                await _context.SaveChangesAsync(); // Eliminar usuario localmente
                _logger.LogInformation("Usuario eliminado de la base local: {UserId}", id);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error eliminando el usuario localmente: {UserId}. Excepción: {Ex}", id, ex);
                return StatusCode(500, new { message = "Error interno eliminando usuario local." });
            }

            // Llama después a la API de Supabase
            using var httpClient = new HttpClient();

            var supabaseUrl = Environment.GetEnvironmentVariable("SUPABASE_URL");
            var serviceRoleKey = Environment.GetEnvironmentVariable("SUPABASE_SERVICE_ROLE_KEY");

            if (string.IsNullOrEmpty(supabaseUrl) || string.IsNullOrEmpty(serviceRoleKey))
            {
                _logger.LogError("Las variables de entorno 'SUPABASE_URL' o 'SUPABASE_SERVICE_ROLE_KEY' no están configuradas.");
                return StatusCode(500, new { message = "Configuración errónea en el servidor. Contáctese con el administrador." });
            }

            var request = new HttpRequestMessage(HttpMethod.Delete, $"{supabaseUrl}/auth/v1/admin/users/{id}");
            request.Headers.Add("Authorization", $"Bearer {serviceRoleKey}"); // Corrección de comillas
            request.Headers.Add("apikey", serviceRoleKey); // Corrección aquí también

            var supabaseResponse = await httpClient.SendAsync(request);

            if (!supabaseResponse.IsSuccessStatusCode)
            {
                _logger.LogError("Error eliminando usuario {UserId} de Supabase", id);
                return StatusCode(500, new { message = "Error en la eliminación de usuario desde Supabase Auth" });
            }

            return NoContent(); // Solo llega aquí si todo salió bien
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error eliminando usuario {UserId}", id);
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }
}