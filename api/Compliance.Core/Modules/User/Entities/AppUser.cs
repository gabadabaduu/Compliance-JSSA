using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Compliance.Core.Modules.User.Entities;

[Table("users")]
public class AppUser
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("email")]
    public string? Email { get; set; }

    [Column("full_name")]
    public string? FullName { get; set; }

    [Column("role")]
    public string Role { get; set; } = "user";

    [Column("nombre_empresa")]
    public string? NombreEmpresa { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime? UpdatedAt { get; set; }

    // Permisos de acceso a módulos
    [Column("access_dashboard")]
    public bool AccessDashboard { get; set; }

    [Column("access_epid")]
    public bool AccessEpid { get; set; }

    [Column("access_rat")]
    public bool AccessRat { get; set; }

    [Column("access_normograma")]
    public bool AccessNormograma { get; set; }

    [Column("access_habeasdata")]
    public bool AccessHabeasdata { get; set; }

    [Column("access_matrizriesgo")]
    public bool AccessMatrizriesgo { get; set; }

    [Column("access_ajustes")]
    public bool AccessAjustes { get; set; }

    [Column("access_usuario")]
    public bool AccessUsuario { get; set; }
}