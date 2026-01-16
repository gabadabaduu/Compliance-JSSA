// ==========================================
// ENUM para Resolution Outcome
// ==========================================
export enum ResolutionOutcome {
    Acogida = 'Acogida',
    NoAcogida = 'No Acogida',
    ParcialmenteAcogida = 'Parcialmente Acogida'
}

// ==========================================
// RESOLUTION - Interface Principal
// ==========================================
export interface Resolution {
    id: number;
    sanctions: string;
    number: number;
    issueDate: Date;
    year: number;
    resolution: string;
    resolutionType: string;
    infringements: number;
    legalGrounds: string;
    sanctionType: number;
    amount: number;
    description: string;
    outcome: ResolutionOutcome;
    orders: string;
    attachment: string | null;
    url: string | null;
}

export interface CreateResolutionDto {
    sanctions: string;
    number: number;
    issueDate: Date;
    year: number;
    resolution: string;
    resolutionType: string;
    infringements: number;
    legalGrounds: string;
    sanctionType: number;
    amount: number;
    description: string;
    outcome: ResolutionOutcome;
    orders: string;
    attachment?: string | null;
    url?: string | null;
}

export interface UpdateResolutionDto extends Partial<CreateResolutionDto> {
    id: number;
}

// ==========================================
// INFRINGEMENT - Tabla Compleja
// ==========================================
export interface Infringement {
    id: number;
    statute: number;
    article: number;
    section: string;
    description: string;
    interpretation: string;
}

export interface CreateInfringementDto {
    statute: number;
    article: number;
    section: string;
    description: string;
    interpretation: string;
}

export interface UpdateInfringementDto extends Partial<CreateInfringementDto> {
    id: number;
}

// ==========================================
// SANCTION TYPE - Tabla Simple
// ==========================================
export interface SanctionType {
    id: number;
    name: string;
}

export interface CreateSanctionTypeDto {
    name: string;
}

export interface UpdateSanctionTypeDto extends Partial<CreateSanctionTypeDto> {
    id: number;
}

// ==========================================
// CATALOG - Tipos Genéricos
// ==========================================
export type CatalogItem = SanctionType | Infringement;

export type CreateCatalogDto = CreateSanctionTypeDto | CreateInfringementDto;

export type UpdateCatalogDto = UpdateSanctionTypeDto | UpdateInfringementDto;

// ==========================================
// CATALOG CONFIG
// ==========================================
export type CatalogType = 'simple' | 'infringement';

export interface CatalogConfig {
    endpoint: string;
    title: string;
    singularName: string;
    pluralName: string;
    type: CatalogType;  // 🆕 Define qué tipo de formulario usar
}