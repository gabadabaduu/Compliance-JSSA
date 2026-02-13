namespace Compliance.Core.Modules.ROPA.Dtos
{
    public class RopaDataFlowDto
    {
        public int Id { get; set; }
        public int? ProcessingActivityId { get; set; }
        public int? EntityId { get; set; }
        public string EntityRole { get; set; } = string.Empty;
        public string? Country { get; set; }
        public string? ParentEntity { get; set; }
        public string? DataAgreement { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }

    public class CreateRopaDataFlowDto
    {
        public int? ProcessingActivityId { get; set; }
        public int? EntityId { get; set; }
        public string EntityRole { get; set; } = string.Empty;
        public string? Country { get; set; }
        public string? ParentEntity { get; set; }
        public string? DataAgreement { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }

    public class UpdateRopaDataFlowDto
    {
        public int Id { get; set; }
        public int? ProcessingActivityId { get; set; }
        public int? EntityId { get; set; }
        public string? EntityRole { get; set; }
        public string? Country { get; set; }
        public string? ParentEntity { get; set; }
        public string? DataAgreement { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }
}