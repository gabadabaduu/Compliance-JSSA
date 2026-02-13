using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Compliance.Infrastructure.Modules.ROPA.Entities
{
    [Table("ropa_subject_categories")]
    public class RopaSubjectCategoryEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        [Required]
        [MaxLength(30)]
        public string Name { get; set; } = string.Empty;

        [Column("description")]
        [MaxLength(100)]
        public string? Description { get; set; }

        [Column("created_by")]
        public string? CreatedBy { get; set; }

        [Column("updated_by")]
        public string? UpdatedBy { get; set; }
    }
}