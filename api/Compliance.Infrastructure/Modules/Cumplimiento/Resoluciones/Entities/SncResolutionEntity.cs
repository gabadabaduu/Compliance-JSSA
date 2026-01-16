using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Compliance.Infrastructure.Modules.Cumplimiento.SncResolutions.Entities
{
    [Table("snc_resolutions")]
    public class SncResolutionEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("sanctions")]
        public int Sanctions { get; set; }

        [Column("number")]
        public int Number { get; set; }

        [Column("issue_date")]
        public DateTime IssueDate { get; set; }

        [Column("year")]
        public int Year { get; set; }

        [Column("resolution")]
        public string Resolution { get; set; } = string.Empty;

        [Column("resolution_type")]
        public string ResolutionType { get; set; } = string.Empty;

        [Column("infringements")]
        public int Infringements { get; set; }

        [Column("legal_grounds")]
        public string LegalGrounds { get; set; } = string.Empty;

        [Column("sanction_type")]
        public int SanctionType { get; set; }

        [Column("amount")]
        public int Amount { get; set; }

        [Column("description")]
        public string Description { get; set; } = string.Empty;

        [Column("outcome")]
        public string Outcome { get; set; } = string.Empty;  // ✅ STRING (no enum)

        [Column("orders")]
        public string Orders { get; set; } = string.Empty;

        [Column("attachment")]
        public string? Attachment { get; set; }

        [Column("url")]
        public string? Url { get; set; }
    }
}