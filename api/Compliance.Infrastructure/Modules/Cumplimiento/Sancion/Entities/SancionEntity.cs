using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Compliance.Core.Modules.Cumplimiento.Sancion.Dtos;

namespace Compliance.Infrastructure.Modules.Cumplimiento.Sancion.Entities
{
    [Table("sanctions")]
    public class SancionEntity
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("number")]
        public int Number { get; set; }

        [Column("entity")]
        public int Entity { get; set; }

        [Column("facts")]
        public string Facts { get; set; } = string.Empty;

        [Column("stage")]
        public SanctionStage Stage { get; set; }

        [Column("status")]
        public SanctionStatus Status { get; set; }

        [Column("initial")]
        public string Initial { get; set; } = string.Empty; 

        [Column("reconsideration")]
        public string Reconsideration { get; set; } = string.Empty; 

        [Column("appeal")]
        public string Appeal { get; set; } = string.Empty; 
    }
}