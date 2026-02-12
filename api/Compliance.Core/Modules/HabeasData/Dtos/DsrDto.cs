using System;

namespace Compliance.Core.Modules.DSR.Dtos
{
    public class DsrDto
    {
        public long Id { get; set; }
        public string CaseId { get; set; } = string.Empty;
        public string RequestId { get; set; } = string.Empty;
        public int Type { get; set; }
        public string Category { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string IdType { get; set; } = string.Empty;
        public string IdNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string RequestDetails { get; set; } = string.Empty;
        public string? Attachment { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime DueDate { get; set; }

        // ✅ CAMBIO: De DateTime? a string?
        public string? Stage { get; set; }
        public string? Status { get; set; }

        public DateTime InitialTerm { get; set; }
        public bool ExtensionTerm { get; set; }
        public DateTime TotalTerm { get; set; }
        public DateTime? ClosedAt { get; set; }
        public DateTime? ResponseContent { get; set; }
        public bool ResponseAttachment { get; set; }
        public string? CreatedBy { get; set; }

        // ✅ NUEVOS
        public string? Tenant { get; set; }
        public string? UpdatedBy { get; set; }
    }

    public class CreateDsrDto
    {
        public string CaseId { get; set; } = string.Empty;
        public string RequestId { get; set; } = string.Empty;
        public int Type { get; set; } // ✅ ID de dsr_request_type

        // ✅ ELIMINAMOS: Ya no se envía desde el frontend
        // public string Category { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;
        public string IdType { get; set; } = string.Empty;
        public string IdNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string RequestDetails { get; set; } = string.Empty;
        public string? Attachment { get; set; }

        public DateTime StartDate { get; set; } // ✅ Fecha de inicio (la única fecha que envía el frontend)

        // ✅ ELIMINAMOS: Se calculan automáticamente
        // public DateTime DueDate { get; set; }
        // public DateTime InitialTerm { get; set; }
        // public DateTime TotalTerm { get; set; }

        public string? Stage { get; set; }
        public string? Status { get; set; }

        public bool ExtensionTerm { get; set; } = false; // ✅ Si tiene prórroga o no

        public DateTime? ClosedAt { get; set; }
        public DateTime? ResponseContent { get; set; }
        public bool ResponseAttachment { get; set; } = false;
        public string? CreatedBy { get; set; }
        public string? Tenant { get; set; }
        public string? UpdatedBy { get; set; }
    }

    public class UpdateDsrDto
    {
        public long Id { get; set; }
        public string? CaseId { get; set; }
        public string? RequestId { get; set; }
        public int? Type { get; set; }
        public string? Category { get; set; }
        public string? FullName { get; set; }
        public string? IdType { get; set; }
        public string? IdNumber { get; set; }
        public string? Email { get; set; }
        public string? RequestDetails { get; set; }
        public string? Attachment { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? DueDate { get; set; }

        // ✅ CAMBIO: De DateTime? a string?
        public string? Stage { get; set; }
        public string? Status { get; set; }

        public DateTime? InitialTerm { get; set; }
        public bool? ExtensionTerm { get; set; }
        public DateTime? TotalTerm { get; set; }
        public DateTime? ClosedAt { get; set; }
        public DateTime? ResponseContent { get; set; }
        public bool? ResponseAttachment { get; set; }
        public string? CreatedBy { get; set; }

        // ✅ NUEVOS
        public string? Tenant { get; set; }
        public string? UpdatedBy { get; set; }
    }

    public class DsrFilterDto
    {
        public int? Type { get; set; }
        public string? Stage { get; set; }
        public string? Status { get; set; }
        public string? CompanyName { get; set; } // Para filtrar por tenant
    }
}