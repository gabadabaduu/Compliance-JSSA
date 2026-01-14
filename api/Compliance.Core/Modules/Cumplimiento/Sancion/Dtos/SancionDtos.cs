namespace Compliance.Core.Modules.Cumplimiento.Sancion.Dtos
{
    public enum SanctionStage
    {
        DecisionInicial,
        RecursoReposicion,
        RecursoApelacion
    }

    public enum SanctionStatus
    {
        EnTramite,
        EnFirme
    }

    public class SancionDto
    {
        public long Id { get; set; }
        public int Number { get; set; }
        public int Entity { get; set; }
        public string Facts { get; set; } = string.Empty;
        public SanctionStage Stage { get; set; }
        public SanctionStatus Status { get; set; }
        public string Initial { get; set; } = string.Empty;
        public string Reconsideration { get; set; } = string.Empty; 
        public string Appeal { get; set; } = string.Empty; 
    }

    public class CreateSancionDto
    {
        public int Number { get; set; }
        public int Entity { get; set; }
        public string Facts { get; set; } = string.Empty;
        public SanctionStage Stage { get; set; }
        public SanctionStatus Status { get; set; }
        public string Initial { get; set; } = string.Empty;  
        public string Reconsideration { get; set; } = string.Empty; 
        public string Appeal { get; set; } = string.Empty; 
    }

    public class UpdateSancionDto
    {
        public long Id { get; set; }
        public int? Number { get; set; }
        public int? Entity { get; set; }
        public string? Facts { get; set; }
        public SanctionStage? Stage { get; set; }
        public SanctionStatus? Status { get; set; }
        public string? Initial { get; set; }
        public string? Reconsideration { get; set; }
        public string? Appeal { get; set; } 
    }
}