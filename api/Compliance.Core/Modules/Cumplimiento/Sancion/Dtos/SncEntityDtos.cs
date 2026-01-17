namespace Compliance.Core.Modules.Cumplimiento.SncEntities.Dtos
{
    public class SncEntityDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string TaxId { get; set; } = string.Empty;
        public int Industry { get; set; }
        public string CompanySize { get; set; } = string.Empty;
    }

    public class CreateSncEntityDto
    {
        public string Name { get; set; } = string.Empty;
        public string TaxId { get; set; } = string.Empty;
        public int Industry { get; set; }
        public string CompanySize { get; set; } = string.Empty;
    }

    public class UpdateSncEntityDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? TaxId { get; set; }
        public int? Industry { get; set; }
        public string? CompanySize { get; set; }
    }
}