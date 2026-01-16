namespace Compliance.Core.Modules.Cumplimiento.SncResolutions.Dtos
{
    public class SncResolutionDto
    {
        public int Id { get; set; }
        public string Sanctions { get; set; } = string.Empty;  // ✅ STRING
        public int Number { get; set; }
        public DateTime IssueDate { get; set; }
        public int Year { get; set; }
        public string Resolution { get; set; } = string.Empty;
        public string ResolutionType { get; set; } = string.Empty;
        public int Infringements { get; set; }
        public string LegalGrounds { get; set; } = string.Empty;
        public int SanctionType { get; set; }
        public int Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Outcome { get; set; } = string.Empty;
        public string Orders { get; set; } = string.Empty;
        public string? Attachment { get; set; }
        public string? Url { get; set; }
    }

    public class CreateSncResolutionDto
    {
        public string Sanctions { get; set; } = string.Empty;  // ✅ STRING
        public int Number { get; set; }
        public DateTime IssueDate { get; set; }
        public int Year { get; set; }
        public string Resolution { get; set; } = string.Empty;
        public string ResolutionType { get; set; } = string.Empty;
        public int Infringements { get; set; }
        public string LegalGrounds { get; set; } = string.Empty;
        public int SanctionType { get; set; }
        public int Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Outcome { get; set; } = string.Empty;
        public string Orders { get; set; } = string.Empty;
        public string? Attachment { get; set; }
        public string? Url { get; set; }
    }

    public class UpdateSncResolutionDto
    {
        public int Id { get; set; }
        public string? Sanctions { get; set; }  // ✅ STRING nullable
        public int? Number { get; set; }
        public DateTime? IssueDate { get; set; }
        public int? Year { get; set; }
        public string? Resolution { get; set; }
        public string? ResolutionType { get; set; }
        public int? Infringements { get; set; }
        public string? LegalGrounds { get; set; }
        public int? SanctionType { get; set; }
        public int? Amount { get; set; }
        public string? Description { get; set; }
        public string? Outcome { get; set; }
        public string? Orders { get; set; }
        public string? Attachment { get; set; }
        public string? Url { get; set; }
    }
}   