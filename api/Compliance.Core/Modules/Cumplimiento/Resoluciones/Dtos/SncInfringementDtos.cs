namespace Compliance.Core.Modules.Cumplimiento.SncInfringements.Dtos
{
    public class SncInfringementDto
    {
        public int Id { get; set; }
        public int Statute { get; set; }
        public int Article { get; set; }
        public string Section { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Interpretation { get; set; } = string.Empty;
    }

    public class CreateSncInfringementDto
    {
        public int Statute { get; set; }
        public int Article { get; set; }
        public string Section { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Interpretation { get; set; } = string.Empty;
    }

    public class UpdateSncInfringementDto
    {
        public int Id { get; set; }
        public int? Statute { get; set; }
        public int? Article { get; set; }
        public string? Section { get; set; }
        public string? Description { get; set; }
        public string? Interpretation { get; set; }
    }
}