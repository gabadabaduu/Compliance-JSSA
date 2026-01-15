using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
        public string Stage { get; set; } = string.Empty;

        [Column("status")]
        public string Status { get; set; } = string.Empty;

        // ✅ Nullable int
        [Column("initial")]
        public int? Initial { get; set; }

        [Column("reconsideration")]
        public int? Reconsideration { get; set; }

        [Column("appeal")]
        public int? Appeal { get; set; }
    }
}