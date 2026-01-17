using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Compliance.Infrastructure.Modules.Cumplimiento.SncEntities.Entities
{
    [Table("snc_entities")]
    public class SncEntityEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Column("tax_id")]
        public string TaxId { get; set; } = string.Empty;

        [Column("industry")]
        public int Industry { get; set; }

        [Column("company_size")]
        public string CompanySize { get; set; } = string.Empty;
    }
}