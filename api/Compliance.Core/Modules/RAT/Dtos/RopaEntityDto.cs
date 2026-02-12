namespace Compliance.Core.Modules.ROPA.Dtos
{
    public class RopaEntityDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string TaxId { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Nature { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string? State { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? LandlineNumber { get; set; }
        public string? MobileNumber { get; set; }
        public string? Email { get; set; }
        public string? Website { get; set; }
        public string? ServiceDescription { get; set; }
        public int? ContactChannelsId { get; set; }
        public string? PrivacyPolicyAttachment { get; set; }
        public string? PrivacyPolicyUrl { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }

    public class CreateRopaEntityDto
    {
        public string Name { get; set; } = string.Empty;
        public string TaxId { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Nature { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string? State { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? LandlineNumber { get; set; }
        public string? MobileNumber { get; set; }
        public string? Email { get; set; }
        public string? Website { get; set; }
        public string? ServiceDescription { get; set; }
        public int? ContactChannelsId { get; set; }
        public string? PrivacyPolicyAttachment { get; set; }
        public string? PrivacyPolicyUrl { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }

    public class UpdateRopaEntityDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? TaxId { get; set; }
        public string? Type { get; set; }
        public string? Nature { get; set; }
        public string? Address { get; set; }
        public string? State { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? LandlineNumber { get; set; }
        public string? MobileNumber { get; set; }
        public string? Email { get; set; }
        public string? Website { get; set; }
        public string? ServiceDescription { get; set; }
        public int? ContactChannelsId { get; set; }
        public string? PrivacyPolicyAttachment { get; set; }
        public string? PrivacyPolicyUrl { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }
}