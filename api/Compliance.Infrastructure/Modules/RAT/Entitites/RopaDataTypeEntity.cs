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
        [MaxLength(255)]
        public string? DataType { get; set; } 

        [Column("created_by")]
        public string? CreatedBy { get; set; }

        [Column("updated_by")]
        public string? UpdatedBy { get; set; }
    }
}