using System;

namespace Compliance.Core.Modules.ROPA.Dtos
{
    public class RopaContractDto
    {
        public int Id { get; set; }
        public string ContractId { get; set; } = string.Empty;
        public int EntityId { get; set; }
        public string ContractType { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public byte[]? Attachment { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }

    public class CreateRopaContractDto
    {
        public string ContractId { get; set; } = string.Empty;
        public int EntityId { get; set; }
        public string ContractType { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public byte[]? Attachment { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }

    public class UpdateRopaContractDto
    {
        public int Id { get; set; }
        public string? ContractId { get; set; }
        public int? EntityId { get; set; }
        public string? ContractType { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Status { get; set; }
        public string? Notes { get; set; }
        public byte[]? Attachment { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }
}