namespace Compliance.Core.Modules.Cumplimiento.SncType.Dtos
{
    public class SncTypeDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    public class CreateSncTypeDto
    {
        public string Name { get; set; } = string.Empty;
    }

    public class UpdateSncTypeDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
    }
}