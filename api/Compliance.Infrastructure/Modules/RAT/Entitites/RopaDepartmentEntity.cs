using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Compliance.Infrastructure.Modules.ROPA.Entities
{
    [Table("ropa_departments")]
    public class RopaDepartmentEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("department_name")]
        [Required]
        [MaxLength(30)]
        public string DepartmentName { get; set; } = string.Empty;

        [Column("created_by")]
        public string? CreatedBy { get; set; }

        [Column("updated_by")]
        public string? UpdatedBy { get; set; }
    }
}