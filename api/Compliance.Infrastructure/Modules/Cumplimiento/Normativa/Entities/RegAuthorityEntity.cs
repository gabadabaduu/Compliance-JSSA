using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Compliance.Core.Modules.Cumplimiento.RegTypes.Dtos;

namespace Compliance.Infrastructure.Modules.Cumplimiento.RegAuthorities.Entities
{
    [Table("reg_authorities")]
    public class RegAuthorityEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; } = string.Empty;
    }
}