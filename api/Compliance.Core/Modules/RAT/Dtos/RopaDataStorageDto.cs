using System;

namespace Compliance.Core.Modules.ROPA.Dtos
{
    public class RopaDataStorageDto
    {
        public int Id { get; set; }
        public string DbName { get; set; } = string.Empty;
        public int RecordCount { get; set; }
        public DateTime CreationDate { get; set; }
        public string? ProcessingMode { get; set; }
        public string DbLocation { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string SecurityMeasures { get; set; } = string.Empty;
        public int? DbCustodian { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
        public string? Tenant { get; set; } // ✅ AGREGAR
    }

    public class CreateRopaDataStorageDto
    {
        public string DbName { get; set; } = string.Empty;
        public int RecordCount { get; set; }
        public DateTime CreationDate { get; set; }
        public string? ProcessingMode { get; set; }
        public string DbLocation { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string SecurityMeasures { get; set; } = string.Empty;
        public int? DbCustodian { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
        public string? Tenant { get; set; } // ✅ AGREGAR
    }

    public class UpdateRopaDataStorageDto
    {
        public int Id { get; set; }
        public string? DbName { get; set; }
        public int? RecordCount { get; set; }
        public DateTime? CreationDate { get; set; }
        public string? ProcessingMode { get; set; }
        public string? DbLocation { get; set; }
        public string? Country { get; set; }
        public string? SecurityMeasures { get; set; }
        public int? DbCustodian { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
        public string? Tenant { get; set; } // ✅ AGREGAR
    }
}