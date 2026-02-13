
export interface RopaTable {
    id: number;
    processingActivity: string;
    captureMethod: string;
    systemId: number | null;
    dataSource: string | null;
    dataTypesId: number | null;
    dataCategories: string | null;
    subjectCategoriesId: number | null;
    purposesId: number | null;
    purposeDescription: string | null;
    storageId: number | null;
    dataShared: string | null;
    recipientsId: number | null;
    retentionPeriod: string;
    processOwner: number | null;
    tenant: string | null;
    createdBy?: string;
    updatedBy?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateRopaTableDto {
    processingActivity: string;
    captureMethod: string;
    systemId: number | null;
    dataSource: string | null;
    dataTypesId: number | null;
    dataCategories: string | null;
    subjectCategoriesId: number | null;
    purposesId: number | null;
    purposeDescription: string | null;
    storageId: number | null;
    dataShared: string | null;
    recipientsId: number | null;
    retentionPeriod: string;
    processOwner: number | null;
    tenant?: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface UpdateRopaTableDto extends CreateRopaTableDto {
    id: number;
}

// Lookup genérico normalizado
export interface RopaLookup {
    id: number;
    name: string;
}
export interface FilterOption {
    value: string | number;
    label: string;
}