namespace Compliance.Core.Modules.ROPA.Dtos
{
    public class RopaDepartmentDto
    {
        public int Id { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }

    public class CreateRopaDepartmentDto
    {
        public string DepartmentName { get; set; } = string.Empty;
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }

    public class UpdateRopaDepartmentDto
    {
        public int Id { get; set; }
        public string? DepartmentName { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }
}