using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Compliance.Core.Modules.Cumplimiento.RegDomains.Dtos;

namespace Compliance.Infrastructure.Modules.Cumplimiento.RegDomains.Entities
{
    [Table("reg_domains")]
    public class RegDomainEntity
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; } = string.Empty;
    }
}