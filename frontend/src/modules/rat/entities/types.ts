// Interface completa para ROPA Entity
export interface RopaEntity {
    id: number;
    name: string;
    taxId: string;
    type: string;
    nature: string;
    address: string;
    state?: string;
    city?: string;
    country?: string;
    landlineNumber?: string;
    mobileNumber?: string;
    email?: string;
    website?: string;
    serviceDescription?: string;
    contactChannelsId?: number | null;
    privacyPolicyAttachment?: string;
    privacyPolicyUrl?: string;
    createdBy?: string;
    updatedBy?: string;
}

// DTO para creación de Entity
export interface CreateRopaEntityDto {
    name: string;
    taxId: string;
    type: string;
    nature: string;
    address: string;
    state?: string;
    city?: string;
    country?: string;
    landlineNumber?: string;
    mobileNumber?: string;
    email?: string;
    website?: string;
    serviceDescription?: string;
    contactChannelsId?: number;
    privacyPolicyAttachment?: string;
    privacyPolicyUrl?: string;
    createdBy?: string;
    updatedBy?: string;
}

// DTO para actualización de Entity
export interface UpdateRopaEntityDto {
    id: number;
    name?: string;
    taxId?: string;
    type?: string;
    nature?: string;
    address?: string;
    state?: string;
    city?: string;
    country?: string;
    landlineNumber?: string;
    mobileNumber?: string;
    email?: string;
    website?: string;
    serviceDescription?: string;
    contactChannelsId?: number;
    privacyPolicyAttachment?: string;
    privacyPolicyUrl?: string;
    createdBy?: string;
    updatedBy?: string;
}

// Interface para ContactChannel (referencia para el dropdown)
export interface ContactChannel {
    id: number;
    channelType: string;
}

// Opciones para filtros
export interface FilterOption {
    value: number | string;
    label: string;
}