using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Compliance.Infrastructure.Modules.DSR.Entities
{
    [Table("dsr_request_type")]
    public class DsrRequestTypeEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("type")]
        public string Type { get; set; } = string.Empty;

        [Column("category")]
        public string? Category { get; set; }

        [Column("initial_term")]
        public string? InitialTerm { get; set; }

        [Column("initial_term_description")]
        public string? InitialTermDescription { get; set; }

        [Column("extension_term")]
        public string? ExtensionTerm { get; set; }

        [Column("extension_term_description")]
        public string? ExtensionTermDescription { get; set; }
    }
}