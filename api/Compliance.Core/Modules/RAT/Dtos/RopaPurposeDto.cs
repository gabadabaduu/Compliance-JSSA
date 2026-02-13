namespace Compliance.Core.Modules.ROPA.Dtos
{
    public class RopaPurposeDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }

    public class CreateRopaPurposeDto
    {
        public string Name { get; set; } = string.Empty;
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }

    public class UpdateRopaPurposeDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }
}