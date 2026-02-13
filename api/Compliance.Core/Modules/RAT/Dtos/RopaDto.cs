namespace Compliance.Core.Modules.ROPA.Dtos
{
    public class RopaDto
    {
        public int Id { get; set; }
        public string ProcessingActivity { get; set; } = string.Empty;
        public string CaptureMethod { get; set; } = string.Empty;
        public int? SystemId { get; set; }
        public string? DataSource { get; set; }
        public int? DataTypesId { get; set; }
        public string? DataCategories { get; set; }
        public int? SubjectCategoriesId { get; set; }
        public int? PurposesId { get; set; }
        public string? PurposeDescription { get; set; }
        public int? StorageId { get; set; }
        public string? DataShared { get; set; }
        public int? RecipientsId { get; set; }
        public string RetentionPeriod { get; set; } = string.Empty;
        public int? ProcessOwner { get; set; }
        public string? Tenant { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }

    public class CreateRopaDto
    {
        public string ProcessingActivity { get; set; } = string.Empty;
        public string CaptureMethod { get; set; } = string.Empty;
        public int? SystemId { get; set; }
        public string? DataSource { get; set; }
        public int? DataTypesId { get; set; }
        public string? DataCategories { get; set; }
        public int? SubjectCategoriesId { get; set; }
        public int? PurposesId { get; set; }
        public string? PurposeDescription { get; set; }
        public int? StorageId { get; set; }
        public string? DataShared { get; set; }
        public int? RecipientsId { get; set; }
        public string RetentionPeriod { get; set; } = string.Empty;
        public int? ProcessOwner { get; set; }
        public string? Tenant { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }

    public class UpdateRopaDto
    {
        public int Id { get; set; }
        public string? ProcessingActivity { get; set; }
        public string? CaptureMethod { get; set; }
        public int? SystemId { get; set; }
        public string? DataSource { get; set; }
        public int? DataTypesId { get; set; }
        public string? DataCategories { get; set; }
        public int? SubjectCategoriesId { get; set; }
        public int? PurposesId { get; set; }
        public string? PurposeDescription { get; set; }
        public int? StorageId { get; set; }
        public string? DataShared { get; set; }
        public int? RecipientsId { get; set; }
        public string? RetentionPeriod { get; set; }
        public int? ProcessOwner { get; set; }
        public string? Tenant { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }
}