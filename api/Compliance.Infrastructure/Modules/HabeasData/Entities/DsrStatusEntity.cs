using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Compliance.Infrastructure.Modules.DSR.Entities
{
    [Table("dsr_status")]
    public class DsrStatusEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("workflow_status")]
        public string WorkflowStatus { get; set; } = string.Empty;

        [Column("case_status")]
        public string CaseStatus { get; set; } = string.Empty;
    }
}