// Interface completa para ROPA Data Storage
export interface RopaDataStorage {
    id: number;
    dbName: string;
    recordCount: number;
    creationDate: Date;
    processingMode: string;
    dbLocation: string;
    country: string;
    securityMeasures: string;
    dbCustodian: number | null;
    createdBy?: string;
    updatedBy?: string;
}

// DTO para creación de Data Storage
export interface CreateRopaDataStorageDto {
    dbName: string;
    recordCount: number;
    creationDate: Date;
    processingMode?: string;
    dbLocation: string;
    country: string;
    securityMeasures: string;
    dbCustodian?: number;
    createdBy?: string;
    updatedBy?: string;
}

// DTO para actualización de Data Storage
export interface UpdateRopaDataStorageDto {
    id: number;
    dbName?: string;
    recordCount?: number;
    creationDate?: Date;
    processingMode?: string;
    dbLocation?: string;
    country?: string;
    securityMeasures?: string;
    dbCustodian?: number;
    createdBy?: string;
    updatedBy?: string;
}

// Interface para RopaDepartment (referencia para el dropdown de custodian)
export interface RopaDepartment {
    id: number;
    departmentName: string;
}

// Opciones para filtros
export interface FilterOption {
    value: number | string;
    label: string;
}