namespace Compliance.Web.DTOs.User;

public class UserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? FullName { get; set; }
    public string Role { get; set; } = string.Empty;
    public string? NombreEmpresa { get; set; }
    public DateTime CreatedAt { get; set; }

    public string updated_by{ get; set; } = string.Empty;
    // Permisos de acceso a m�dulos
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
    public string? UpdatedBy { get; set; }
}

// DTO para actualizar informaci�n del usuario
public class UpdateUserDto
{
    public string? FullName { get; set; }
    public string? NombreEmpresa { get; set; }
    public string? Role { get; set; }
}