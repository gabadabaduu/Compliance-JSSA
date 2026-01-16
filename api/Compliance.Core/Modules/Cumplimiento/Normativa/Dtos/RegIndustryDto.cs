namespace Compliance.Core.Modules.Cumplimiento.RegIndustries.Dtos
{
    public class RegIndustryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    public class CreateRegIndustryDto
    {
        public string Name { get; set; } = string.Empty;
    }

    public class UpdateRegIndustryDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
    }
}