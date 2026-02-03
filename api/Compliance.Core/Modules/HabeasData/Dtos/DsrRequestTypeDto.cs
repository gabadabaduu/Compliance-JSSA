namespace Compliance.Core.Modules.DSR.Dtos
{
    public class DsrRequestTypeDto
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string? Category { get; set; }
        public string? InitialTerm { get; set; }
        public string? InitialTermDescription { get; set; }
        public string? ExtensionTerm { get; set; }
        public string? ExtensionTermDescription { get; set; }
    }

    public class CreateDsrRequestTypeDto
    {
        public string Type { get; set; } = string.Empty;
        public string? Category { get; set; }
        public string? InitialTerm { get; set; }
        public string? InitialTermDescription { get; set; }
        public string? ExtensionTerm { get; set; }
        public string? ExtensionTermDescription { get; set; }
    }

    public class UpdateDsrRequestTypeDto
    {
        public int Id { get; set; }
        public string? Type { get; set; }
        public string? Category { get; set; }
        public string? InitialTerm { get; set; }
        public string? InitialTermDescription { get; set; }
        public string? ExtensionTerm { get; set; }
        public string? ExtensionTermDescription { get; set; }
    }
}