using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Compliance.Infrastructure.Modules.Cumplimiento.SncInfringements.Entities
{
    [Table("snc_infringements")]
    public class SncInfringementEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("statute")]
        public int Statute { get; set; }

        [Column("article")]
        public int Article { get; set; }

        [Column("section")]
        public string Section { get; set; } = string.Empty;

        [Column("description")]
        public string Description { get; set; } = string.Empty;

        [Column("interpretation")]
        public string Interpretation { get; set; } = string.Empty;
    }
}