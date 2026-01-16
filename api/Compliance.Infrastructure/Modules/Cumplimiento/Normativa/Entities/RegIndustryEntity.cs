using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Compliance.Core.Modules.Cumplimiento.RegIndustries.Dtos;

namespace Compliance.Infrastructure.Modules.Cumplimiento.RegIndustries.Entities
{
    [Table("reg_industries")]
    public class RegIndustryEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; } = string.Empty;
    }
}