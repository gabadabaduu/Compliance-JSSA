using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Compliance.Infrastructure.Entities
{
    [Table("Epid")]
    public class Epid
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("name")]
        public string Name { get; set; } = string.Empty;
    }
}