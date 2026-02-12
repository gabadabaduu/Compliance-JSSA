using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Compliance.Infrastructure.Modules.ROPA.Entities
{
    [Table("contact_channels")]
    public class ContactChannelEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("channel_type")]
        [Required]
        [MaxLength(255)]
        public string ChannelType { get; set; } = string.Empty;

        [Column("mobile_app")]
        [MaxLength(30)]
        public string? MobileApp { get; set; }

        [Column("email")]
        [MaxLength(50)]
        public string? Email { get; set; }

        [Column("fax")]
        [MaxLength(50)]
        public string? Fax { get; set; }

        [Column("address")]
        [MaxLength(255)]
        public string? Address { get; set; }

        [Column("website")]
        [MaxLength(50)]
        public string? Website { get; set; }

        [Column("landline_phone")]
        [MaxLength(50)]
        public string? LandlinePhone { get; set; }

        [Column("mobile_phone")]
        [MaxLength(50)]
        public string? MobilePhone { get; set; }

        [Column("created_by")]
        public string? CreatedBy { get; set; }

        [Column("updated_by")]
        public string? UpdatedBy { get; set; }
    }
}