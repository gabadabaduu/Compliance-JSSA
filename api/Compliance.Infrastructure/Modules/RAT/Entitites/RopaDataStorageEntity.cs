using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Compliance.Infrastructure.Modules.ROPA.Entities
{
    [Table("ropa_data_storage")]
    public class RopaDataStorageEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("db_name")]
        [Required]
        [MaxLength(30)]
        public string DbName { get; set; } = string.Empty;

        [Column("record_count")]
        public int RecordCount { get; set; }

        [Column("creation_date")]
        public DateTime CreationDate { get; set; }

        [Column("processing_mode")]
        [MaxLength(30)]
        public string? ProcessingMode { get; set; }

        [Column("db_location")]
        [Required]
        [MaxLength(30)]
        public string DbLocation { get; set; } = string.Empty;

        [Column("country")]
        [Required]
        [MaxLength(30)]
        public string Country { get; set; } = string.Empty;

        [Column("security_measures")]
        [Required]
        [MaxLength(255)]
        public string SecurityMeasures { get; set; } = string.Empty;

        [Column("db_custodian")]
        public int? DbCustodian { get; set; }

        [Column("created_by")]
        public string? CreatedBy { get; set; }

        [Column("updated_by")]
        public string? UpdatedBy { get; set; }

        [Column("tenant")]
        [MaxLength(255)]
        public string? Tenant { get; set; }
    }
}