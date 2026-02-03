namespace Compliance.Core.Modules.DSR.Dtos
{
    public class DsrStatusDto
    {
        public int Id { get; set; }
        public string WorkflowStatus { get; set; } = string.Empty;
        public string CaseStatus { get; set; } = string.Empty;
    }

    public class CreateDsrStatusDto
    {
        public string WorkflowStatus { get; set; } = string.Empty;
        public string CaseStatus { get; set; } = string.Empty;
    }

    public class UpdateDsrStatusDto
    {
        public int Id { get; set; }
        public string? WorkflowStatus { get; set; }
        public string? CaseStatus { get; set; }
    }
}