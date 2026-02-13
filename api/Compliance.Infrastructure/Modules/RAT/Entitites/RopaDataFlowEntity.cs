using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Compliance.Infrastructure.Modules.ROPA.Entities
{
    [Table("ropa_data_flow")]
    public class RopaDataFlowEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("processing_activity_id")]
        public int? ProcessingActivityId { get; set; }

        [Column("entity_id")]
        public int? EntityId { get; set; }

        [Column("entity_role")]
        [Required]
        [MaxLength(30)]
        public string EntityRole { get; set; } = string.Empty;

        [Column("country")]
        public string? Country { get; set; }

        [Column("parent_entity")]
        [MaxLength(30)]
        public string? ParentEntity { get; set; }

        [Column("data_agreement")]
        public string? DataAgreement { get; set; }

        [Column("created_by")]
        public string? CreatedBy { get; set; }

        [Column("updated_by")]
        public string? UpdatedBy { get; set; }
    }
}