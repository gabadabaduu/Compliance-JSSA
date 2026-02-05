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

        // ✅ CAMBIO: De string a int?
        [Column("initial_term")]
        public int? InitialTerm { get; set; }

        [Column("initial_term_description")]
        public string? InitialTermDescription { get; set; }

        // ✅ CAMBIO: De string a int?
        [Column("extension_term")]
        public int? ExtensionTerm { get; set; }

        [Column("extension_term_description")]
        public string? ExtensionTermDescription { get; set; }
    }
}