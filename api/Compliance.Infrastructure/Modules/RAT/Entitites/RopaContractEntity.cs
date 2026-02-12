using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Compliance.Infrastructure.Modules.ROPA.Entities
{
    [Table("ropa_contracts")]
    public class RopaContractEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("contract_id")]
        [Required]
        [MaxLength(255)]
        public string ContractId { get; set; } = string.Empty;

        [Column("entity_id")]
        public int EntityId { get; set; }

        [Column("contract_type")]
        [Required]
        [MaxLength(255)]
        public string ContractType { get; set; } = string.Empty;

        [Column("start_date")]
        public DateTime StartDate { get; set; }

        [Column("end_date")]
        public DateTime EndDate { get; set; }

        [Column("status")]
        [Required]
        [MaxLength(255)]
        public string Status { get; set; } = string.Empty;

        [Column("notes")]
        [Required]
        [MaxLength(255)]
        public string Notes { get; set; } = string.Empty;

        [Column("attachment")]
        public byte[]? Attachment { get; set; }

        [Column("created_by")]
        public string? CreatedBy { get; set; }

        [Column("updated_by")]
        public string? UpdatedBy { get; set; }
    }
}