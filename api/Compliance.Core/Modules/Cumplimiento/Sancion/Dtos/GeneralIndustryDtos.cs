namespace Compliance.Core.Modules.Cumplimiento.GeneralIndustries.Dtos
{
    public class GeneralIndustryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    public class CreateGeneralIndustryDto
    {
        public string Name { get; set; } = string.Empty;
    }

    public class UpdateGeneralIndustryDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
    }
}