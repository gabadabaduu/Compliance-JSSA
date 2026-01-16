namespace Compliance.Core.Modules.Cumplimiento.Sancion.Dtos
{
    public class SancionDto
    {
        public long Id { get; set; }
        public int Number { get; set; }
        public int Entity { get; set; }
        public string Facts { get; set; } = string.Empty;
        public string Stage { get; set; } = string.Empty;  // ✅ String para coincidir con DB
        public string Status { get; set; } = string.Empty; // ✅ String para coincidir con DB
        public int? Initial { get; set; }
        public int? Reconsideration { get; set; }
        public int? Appeal { get; set; }
    }

    public class CreateSancionDto
    {
        public int Number { get; set; }
        public int Entity { get; set; }
        public string Facts { get; set; } = string.Empty;
        public string Stage { get; set; } = string.Empty;  // ✅ String
        public string Status { get; set; } = string.Empty; // ✅ String
        public int? Initial { get; set; }
        public int? Reconsideration { get; set; }
        public int? Appeal { get; set; }
    }

    public class UpdateSancionDto
    {
        public long Id { get; set; }
        public int? Number { get; set; }
        public int? Entity { get; set; }
        public string? Facts { get; set; }
        public string? Stage { get; set; }  // ✅ Nullable string
        public string? Status { get; set; } // ✅ Nullable string
        public int? Initial { get; set; }
        public int? Reconsideration { get; set; }
        public int? Appeal { get; set; }
    }
}