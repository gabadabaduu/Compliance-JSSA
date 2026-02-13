using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Compliance.Infrastructure.Modules.ROPA.Entities
{
    [Table("ropa")]
    public class RopaEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("processing_activity")]
        [Required]
        [MaxLength(255)]
        public string ProcessingActivity { get; set; } = string.Empty;

        [Column("capture_method")]
        [Required]
        [MaxLength(30)]
        public string CaptureMethod { get; set; } = string.Empty;

        [Column("system_id")]
        public int? SystemId { get; set; }

        [Column("data_source")]
        [MaxLength(30)]
        public string? DataSource { get; set; }

        [Column("data_types_id")]
        public int? DataTypesId { get; set; }

        [Column("data_categories")]
        [MaxLength(30)]
        public string? DataCategories { get; set; }

        [Column("subject_categories_id")]
        public int? SubjectCategoriesId { get; set; }

        [Column("purposes_id")]
        public int? PurposesId { get; set; }

        [Column("purpose_description")]
        [MaxLength(255)]
        public string? PurposeDescription { get; set; }

        [Column("storage_id")]
        public int? StorageId { get; set; }

        [Column("data_shared")]
        [MaxLength(50)]
        public string? DataShared { get; set; }

        [Column("recipients_id")]
        public int? RecipientsId { get; set; }

        [Column("retention_period")]
        [Required]
        [MaxLength(255)]
        public string RetentionPeriod { get; set; } = string.Empty;

        [Column("process_owner")]
        public int? ProcessOwner { get; set; }

        [Column("tenant")]
        [MaxLength(255)]
        public string? Tenant { get; set; }

        [Column("created_by")]
        [MaxLength(255)]
        public string? CreatedBy { get; set; }

        [Column("updated_by")]
        [MaxLength(255)]
        public string? UpdatedBy { get; set; }
    }
}