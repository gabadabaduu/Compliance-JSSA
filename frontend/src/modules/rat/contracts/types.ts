// Interface completa para ROPA Contract
export interface RopaContract {
    id: number;
    contractId: string;
    entityId: number;
    contractType: string;
    startDate: Date;
    endDate: Date;
    status: string;
    notes: string;
    attachment: string | null; // base64 string del PDF
    attachmentFileName?: string; // nombre original del archivo
    createdBy?: string;
    updatedBy?: string;
}

// DTO para creación de Contract
export interface CreateRopaContractDto {
    contractId: string;
    entityId: number;
    contractType: string;
    startDate: Date;
    endDate: Date;
    status: string;
    notes: string;
    attachment?: string; // base64 sin prefijo data:...
    attachmentFileName?: string;
    createdBy?: string;
    updatedBy?: string;
}

// DTO para actualización de Contract
export interface UpdateRopaContractDto {
    id: number;
    contractId?: string;
    entityId?: number;
    contractType?: string;
    startDate?: Date;
    endDate?: Date;
    status?: string;
    notes?: string;
    attachment?: string;
    attachmentFileName?: string;
    createdBy?: string;
    updatedBy?: string;
}

// Interface para Entity (referencia para el dropdown)
export interface RopaEntityRef {
    id: number;
    name: string;
}

// Opciones para filtros
export interface FilterOption {
    value: number | string;
    label: string;
}