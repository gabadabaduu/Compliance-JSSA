namespace Compliance.Core.Modules.ROPA.Dtos
{
    public class ContactChannelDto
    {
        public int Id { get; set; }
        public string ChannelType { get; set; } = string.Empty;
        public string? MobileApp { get; set; }
        public string? Email { get; set; }
        public string? Fax { get; set; }
        public string? Address { get; set; }
        public string? Website { get; set; }
        public string? LandlinePhone { get; set; }
        public string? MobilePhone { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }

    public class CreateContactChannelDto
    {
        public string ChannelType { get; set; } = string.Empty;
        public string? MobileApp { get; set; }
        public string? Email { get; set; }
        public string? Fax { get; set; }
        public string? Address { get; set; }
        public string? Website { get; set; }
        public string? LandlinePhone { get; set; }
        public string? MobilePhone { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }

    public class UpdateContactChannelDto
    {
        public int Id { get; set; }
        public string? ChannelType { get; set; }
        public string? MobileApp { get; set; }
        public string? Email { get; set; }
        public string? Fax { get; set; }
        public string? Address { get; set; }
        public string? Website { get; set; }
        public string? LandlinePhone { get; set; }
        public string? MobilePhone { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }
}