using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Compliance.Infrastructure.Modules.ROPA.Entities
{
    [Table("ropa_entities")]
    public class RopaEntityEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [Column("tax_id")]
        [Required]
        [MaxLength(200)]
        public string TaxId { get; set; } = string.Empty;

        [Column("type")]
        [Required]
        [MaxLength(200)]
        public string Type { get; set; } = string.Empty;

        [Column("nature")]
        [Required]
        [MaxLength(200)]
        public string Nature { get; set; } = string.Empty;

        [Column("address")]
        [Required]
        [MaxLength(255)]
        public string Address { get; set; } = string.Empty;

        [Column("state")]
        public string? State { get; set; }

        [Column("city")]
        public string? City { get; set; }

        [Column("country")]
        public string? Country { get; set; }

        [Column("landline_number")]
        [MaxLength(30)]
        public string? LandlineNumber { get; set; }

        [Column("mobile_number")]
        [MaxLength(30)]
        public string? MobileNumber { get; set; }

        [Column("email")]
        [MaxLength(30)]
        public string? Email { get; set; }

        [Column("website")]
        [MaxLength(255)]
        public string? Website { get; set; }

        [Column("service_description")]
        [MaxLength(255)]
        public string? ServiceDescription { get; set; }

        [Column("contact_channels_id")]
        public int? ContactChannelsId { get; set; }

        [Column("privacy_policy_attachment")]
        [MaxLength(255)]
        public string? PrivacyPolicyAttachment { get; set; }

        [Column("privacy_policy_url")]
        [MaxLength(255)]
        public string? PrivacyPolicyUrl { get; set; }

        [Column("created_by")]
        public string? CreatedBy { get; set; }

        [Column("updated_by")]
        public string? UpdatedBy { get; set; }

        [Column("tenant")]
        [MaxLength(255)]
        public string? Tenant { get; set; } 
    }
}