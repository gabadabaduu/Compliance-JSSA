namespace Compliance.Web.DTOs.User;

public class UserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? FullName { get; set; }
    public string Role { get; set; } = string.Empty;
    public string? NombreEmpresa { get; set; }
    public DateTime CreatedAt { get; set; }

    // Permisos de acceso a módulos
    public bool AccessDashboard { get; set; }
    public bool AccessEpid { get; set; }
    public bool AccessRat { get; set; }
    public bool AccessNormograma { get; set; }
    public bool AccessHabeasdata { get; set; }
    public bool AccessMatrizriesgo { get; set; }
    public bool AccessAjustes { get; set; }
    public bool AccessUsuario { get; set; }
}

// DTO para actualizar permisos de usuario
public class UpdateUserPermissionsDto
{
    public bool AccessDashboard { get; set; }
    public bool AccessEpid { get; set; }
    public bool AccessRat { get; set; }
    public bool AccessNormograma { get; set; }
    public bool AccessHabeasdata { get; set; }
    public bool AccessMatrizriesgo { get; set; }
    public bool AccessAjustes { get; set; }
    public bool AccessUsuario { get; set; }
}

// DTO para actualizar información del usuario
public class UpdateUserDto
{
    public string? FullName { get; set; }
    public string? NombreEmpresa { get; set; }
    public string? Role { get; set; }
}