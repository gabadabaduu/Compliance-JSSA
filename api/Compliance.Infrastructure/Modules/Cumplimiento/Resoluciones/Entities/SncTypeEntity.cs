using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Compliance.Infrastructure.Modules.Cumplimiento.SncType.Entities
{
	[Table("snc_type")]
	public class SncTypeEntity
	{
		[Key]
		[Column("id")]
		public int Id { get; set; }

		[Column("name")]
		public string Name { get; set; } = string.Empty;
	}
}