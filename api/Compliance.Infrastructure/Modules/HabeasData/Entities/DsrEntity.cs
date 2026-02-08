using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Compliance.Infrastructure.Modules.DSR.Entities
{
    [Table("dsr")]
    public class DsrEntity
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("case_id")]
        public string CaseId { get; set; } = string.Empty;

        [Column("request_id")]
        public string RequestId { get; set; } = string.Empty;

        [Column("type")]
        public int Type { get; set; }

        [Column("category")]
        public string Category { get; set; } = string.Empty;

        [Column("full_name")]
        public string FullName { get; set; } = string.Empty;

        [Column("id_type")]
        public string IdType { get; set; } = string.Empty;

        [Column("id_number")]
        public string IdNumber { get; set; } = string.Empty;

        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Column("request_details")]
        public string RequestDetails { get; set; } = string.Empty;

        [Column("attachment")]
        public string? Attachment { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("start_date")]
        public DateTime StartDate { get; set; }

        [Column("due_date")]
        public DateTime DueDate { get; set; }

        // ✅ CAMBIO: De DateTime? a string?
        [Column("stage")]
        public string? Stage { get; set; }

        // ✅ CAMBIO: De DateTime? a string?
        [Column("status")]
        public string? Status { get; set; }

        [Column("initial_term")]
        public DateTime InitialTerm { get; set; }

        [Column("extension_term")]
        public bool ExtensionTerm { get; set; } = false;

        [Column("total_term")]
        public DateTime TotalTerm { get; set; }

        [Column("closed_at")]
        public DateTime? ClosedAt { get; set; }

        [Column("response_content")]
        public DateTime? ResponseContent { get; set; }

        [Column("response_attachment")]
        public bool ResponseAttachment { get; set; } = false;

        [Column("created_by")]
        public string? CreatedBy { get; set; }

        // ✅ NUEVOS CAMPOS
        [Column("tenant")]
        public string? Tenant { get; set; }

        [Column("updated_by")]
        public string? UpdatedBy { get; set; }
    }
}