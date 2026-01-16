using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Compliance.Core.Modules.Cumplimiento.RegTypes.Dtos;

namespace Compliance.Infrastructure.Modules.Cumplimiento.RegTypes.Entities
{
    [Table("reg_types")]
    public class RegTypeEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("type")]
        public string Type { get; set; } = string.Empty;
    }
}