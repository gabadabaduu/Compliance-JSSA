namespace Compliance.Core.Modules.Cumplimiento.RegTypes.Dtos
{
    public class RegTypeDto
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;
    }

    public class CreateRegTypeDto
    {
        public string Type { get; set; } = string.Empty;
    }

    public class UpdateRegTypeDto
    {
        public int Id { get; set; }
        public string? Type { get; set; }
    }
}