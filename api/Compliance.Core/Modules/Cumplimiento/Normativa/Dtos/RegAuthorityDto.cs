namespace Compliance.Core.Modules.Cumplimiento.RegAuthorities.Dtos
{
    public class RegAuthorityDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    public class CreateRegAuthorityDto
    {
        public string Name { get; set; } = string.Empty;
    }

    public class UpdateRegAuthorityDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
    }
}