namespace Compliance.Core.Modules.Cumplimiento.RegDomains.Dtos
{
    public class RegDomainDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    public class CreateRegDomainDto
    {
        public string Name { get; set; } = string.Empty;
    }

    public class UpdateRegDomainDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
    }
}