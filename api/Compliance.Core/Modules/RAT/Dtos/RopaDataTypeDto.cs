namespace Compliance.Core.Modules.ROPA.Dtos
{
    public class RopaDataTypeDto
    {
        public int Id { get; set; }
        public string DataType { get; set; } = string.Empty;
        public string DataCategory { get; set; } = string.Empty;
        public string DataGroup { get; set; } = string.Empty;
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }

    public class CreateRopaDataTypeDto
    {
        public string DataType { get; set; } = string.Empty;
        public string DataCategory { get; set; } = string.Empty;
        public string DataGroup { get; set; } = string.Empty;
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }

    public class UpdateRopaDataTypeDto
    {
        public int Id { get; set; }
        public string? DataType { get; set; }
        public string? DataCategory { get; set; }
        public string? DataGroup { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }
}