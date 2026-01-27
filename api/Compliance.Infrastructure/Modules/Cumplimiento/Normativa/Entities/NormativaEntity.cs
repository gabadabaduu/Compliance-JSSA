using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Compliance.Core.Modules.Cumplimiento.Normativa.Dtos;

namespace Compliance.Infrastructure.Modules.Cumplimiento.Normativa.Entities
{
    [Table("regulations")]
    public class NormativaEntity
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("type")]
        public int Type { get; set; }

        [Column("number")]
        public int Number { get; set; }

        [Column("issue_date")]
        public DateTime IssueDate { get; set; }

        [Column("year")]
        public int Year { get; set; }

        [Column("regulation")]
        public string Regulation { get; set; } = string.Empty;

        [Column("common_name")]
        public string CommonName { get; set; } = string.Empty;

        [Column("industry")]
        public int Industry { get; set; }

        [Column("authority")]
        public int Authority { get; set; }

        [Column("title")]
        public string Title { get; set; } = string.Empty;

        [Column("domain")]
        public int Domain { get; set; }

        [Column("status")]
        public string Status { get; set; } = string.Empty;

        [Column("url")]
        public string Url { get; set; } = string.Empty;

        // ✅ NUEVAS COLUMNAS
        [Column("created_by")]
        public string? CreatedBy { get; set; }

        [Column("allowed")]
        public bool Allowed { get; set; } = false;
    }
}