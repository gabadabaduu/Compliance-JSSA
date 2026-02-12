// Interface completa para DSR (Data Subject Request)
export interface Dsr {
    id: number;
    caseId: string;
    requestId: string;
    type: number;
    category: string;
    fullName: string;
    idType: string;
    idNumber: string;
    email: string;
    requestDetails: string;
    attachment?: string;
    createdAt: Date;
    startDate: Date;
    dueDate: Date;
    stage?: string;
    status?: string;
    initialTerm: Date;
    extensionTerm: boolean;
    totalTerm: Date;
    closedAt?: Date;
    responseContent?: Date;
    responseAttachment: boolean;
    createdBy?: string;
    updatedBy?: string;
    tenant?: string;
}

// DTO para creación de DSR
export interface CreateDsrDto {
    caseId: string;
    requestId: string;
    type: number;
    fullName: string;
    idType: string;
    idNumber: string;
    email: string;
    requestDetails: string;
    attachment?: string;
    startDate: Date;
    extensionTerm: boolean;
    stage?: string;
    status?: string;
    closedAt?: Date;
    responseContent?: Date;
    responseAttachment?: boolean;
    createdBy?: string;
    updatedBy?: string;
    tenant?: string;
}

// DTO para actualización de DSR
export interface UpdateDsrDto {
    id: number;
    caseId?: string;
    requestId?: string;
    type?: number;
    category?: string;
    fullName?: string;
    idType?: string;
    idNumber?: string;
    email?: string;
    requestDetails?: string;
    attachment?: string;
    startDate?: Date;
    extensionTerm?: boolean;
    stage?: string;
    status?: string;
    closedAt?: Date;
    responseContent?: Date;
    responseAttachment?: boolean;
    createdBy?: string;
    updatedBy?: string;
    tenant?: string;
}

// Interface para DsrRequestType (tipos de solicitud)
export interface DsrRequestType {
    id: number;
    type: string;
    category?: string;
    initialTerm?: number;
    initialTermDescription?: string;
    extensionTerm?: number;
    extensionTermDescription?: string;
}

// Interface para DsrStatus
export interface DsrStatus {
    id: number;
    workflowStatus: string;
    caseStatus: string;
}

// Opciones para filtros
export interface FilterOption {
    value: number | string;
    label: string;
}