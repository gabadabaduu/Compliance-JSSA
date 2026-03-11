namespace Compliance.Core.Modules.Cumplimiento.Normativa.Dtos
{
    // DTO completo para Normativa
    public class NormativaDto
    {
        public long Id { get; set; }
        public int Type { get; set; }
        public int Number { get; set; }
        public DateTime IssueDate { get; set; }
        public int Year { get; set; }
        public string Regulation { get; set; } = string.Empty;
        public string CommonName { get; set; } = string.Empty;
        public int Industry { get; set; }
        public int Authority { get; set; }
        public string Title { get; set; } = string.Empty;
        public int Domain { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string? CreatedBy { get; set; } // ✅ NUEVO
        public bool Allowed { get; set; }      // ✅ NUEVO
        public DateTime CreatedAt { get; set; }
    }

    // DTO para creación
    public class CreateNormativaDto
    {
        public int Type { get; set; }
        public int Number { get; set; }
        public DateTime IssueDate { get; set; }
        public int Year { get; set; }
        public string Regulation { get; set; } = string.Empty;
        public string CommonName { get; set; } = string.Empty;
        public int Industry { get; set; }
        public int Authority { get; set; }
        public string Title { get; set; } = string.Empty;
        public int Domain { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string? CreatedBy { get; set; } // ✅ NUEVO (opcional en creación)
        public bool Allowed { get; set; } = false; // ✅ NUEVO (default false)
    }

    // DTO para actualización
    public class UpdateNormativaDto
    {
        public long Id { get; set; }
        public int? Type { get; set; }
        public int? Number { get; set; }
        public DateTime? IssueDate { get; set; }
        public int? Year { get; set; }
        public string? Regulation { get; set; }
        public string? CommonName { get; set; }
        public int? Industry { get; set; }
        public int? Authority { get; set; }
        public string? Title { get; set; }
        public int? Domain { get; set; }
        public string? Status { get; set; }
        public string? Url { get; set; }
        public string? CreatedBy { get; set; } // ✅ NUEVO
        public bool? Allowed { get; set; }     // ✅ NUEVO
    }
}