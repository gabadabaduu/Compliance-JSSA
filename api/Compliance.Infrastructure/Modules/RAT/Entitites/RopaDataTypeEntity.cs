using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Compliance.Infrastructure.Modules.ROPA.Entities
{
    [Table("ropa_data_types")]
    public class RopaDataTypeEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("data_type")]
        [Required]
        [MaxLength(255)]
        public string DataType { get; set; } = string.Empty;

        [Column("data_category")]
        [Required]
        [MaxLength(30)]
        public string DataCategory { get; set; } = string.Empty;

        [Column("data_group")]
        [Required]
        [MaxLength(255)]
        public string DataGroup { get; set; } = string.Empty;

        [Column("created_by")]
        public string? CreatedBy { get; set; }

        [Column("updated_by")]
        public string? UpdatedBy { get; set; }
    }
}