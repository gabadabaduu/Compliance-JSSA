namespace Compliance.Core.Modules.DSR.Dtos
{
    public class DsrRequestTypeDto
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string? Category { get; set; }
        public int? InitialTerm { get; set; } // ✅ CAMBIO: De string a int?
        public string? InitialTermDescription { get; set; }
        public int? ExtensionTerm { get; set; } // ✅ CAMBIO: De string a int?
        public string? ExtensionTermDescription { get; set; }
    }

    public class CreateDsrRequestTypeDto
    {
        public string Type { get; set; } = string.Empty;
        public string? Category { get; set; }
        public int? InitialTerm { get; set; } // ✅ CAMBIO: De string a int?
        public string? InitialTermDescription { get; set; }
        public int? ExtensionTerm { get; set; } // ✅ CAMBIO: De string a int?
        public string? ExtensionTermDescription { get; set; }
    }

    public class UpdateDsrRequestTypeDto
    {
        public int Id { get; set; }
        public string? Type { get; set; }
        public string? Category { get; set; }
        public int? InitialTerm { get; set; } // ✅ CAMBIO: De string a int?
        public string? InitialTermDescription { get; set; }
        public int? ExtensionTerm { get; set; } // ✅ CAMBIO: De string a int?
        public string? ExtensionTermDescription { get; set; }
    }
}