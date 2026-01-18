// ============================================
// 🎯 SANCTIONS - Enums (UNION TYPES)
// ============================================

export type SanctionStage =
    | 'Decisión Inicial'
    | 'Recurso de Reposición'
    | 'Recurso de Apelación';

export type SanctionStatus =
    | 'En trámite'
    | 'En firme';

// Helpers para trabajar con los enums
export const SANCTION_STAGES: SanctionStage[] = [
    'Decisión Inicial',
    'Recurso de Reposición',
    'Recurso de Apelación'
];

export const SANCTION_STATUSES: SanctionStatus[] = [
    'En trámite',
    'En firme'
];

// Labels amigables para mostrar en UI
export const SANCTION_STAGE_LABELS: Record<SanctionStage, string> = {
    'Decisión Inicial': 'Decisión Inicial',
    'Recurso de Reposición': 'Recurso de Reposición',
    'Recurso de Apelación': 'Recurso de Apelación'
};

export const SANCTION_STATUS_LABELS: Record<SanctionStatus, string> = {
    'En trámite': 'En Trámite',
    'En firme': 'En Firme'
};

// ============================================
// 📋 SANCTION - Interface Principal
// ============================================

export interface Sanction {
    id: number;
    number: number;
    entity: number;           // FK a snc_entities
    facts: string;
    stage: SanctionStage;
    status: SanctionStatus;
    initial: number | null;   // FK a snc_resolutions
    reconsideration: number | null;  // FK a snc_resolutions
    appeal: number | null;    // FK a snc_resolutions
}

export interface CreateSanctionDto {
    number: number;
    entity: number;
    facts: string;
    stage: SanctionStage;
    status: SanctionStatus;
    initial?: number | null;
    reconsideration?: number | null;
    appeal?: number | null;
}

export interface UpdateSanctionDto extends Partial<CreateSanctionDto> {
    id: number;
}

// ============================================
// 📋 ENTITY - Tabla Compleja (snc_entities)
// ============================================

export interface Entity {
    id: number;
    name: string;
    industry: number;     // FK a general_industries
    description: string;
}

export interface CreateEntityDto {
    name: string;
    industry: number;
    description: string;
}

export interface UpdateEntityDto extends Partial<CreateEntityDto> {
    id: number;
}

// ============================================
// 📋 INDUSTRY - Tabla Simple (general_industries)
// ============================================

export interface Industry {
    id: number;
    name: string;
}

export interface CreateIndustryDto {
    name: string;
}

export interface UpdateIndustryDto extends Partial<CreateIndustryDto> {
    id: number;
}

// ============================================
// 📦 CATALOG - Tipos Genéricos
// ============================================

export type CatalogItem = Entity | Industry;

export type CreateCatalogDto = CreateEntityDto | CreateIndustryDto;

export type UpdateCatalogDto = UpdateEntityDto | UpdateIndustryDto;

// ============================================
// ⚙️ CATALOG CONFIG
// ============================================

export type CatalogType = 'simple' | 'entity';

export interface CatalogConfig {
    endpoint: string;
    title: string;
    singularName: string;
    pluralName: string;
    type: CatalogType;
}

// ============================================
// 🔍 HELPERS para validación
// ============================================

export function isValidSanctionStage(stage: string): stage is SanctionStage {
    return SANCTION_STAGES.includes(stage as SanctionStage);
}

export function isValidSanctionStatus(status: string): status is SanctionStatus {
    return SANCTION_STATUSES.includes(status as SanctionStatus);
}

// Helper para obtener color de badge según status
export function getStatusColor(status: SanctionStatus): string {
    switch (status) {
        case 'En trámite':
            return 'orange';
        case 'En firme':
            return 'green';
        default:
            return 'gray';
    }
}

// Helper para obtener color de badge según stage
export function getStageColor(stage: SanctionStage): string {
    switch (stage) {
        case 'Decisión Inicial':
            return 'blue';
        case 'Recurso de Reposición':
            return 'purple';
        case 'Recurso de Apelación':
            return 'red';
        default:
            return 'gray';
    }
}

// ============================================
// 📋 ENTITY - Tabla Compleja (snc_entities)
// ============================================

export interface Entity {
    id: number;
    name: string;
    taxId: string;           // ✅ Agregar
    industry: number;        // FK a general_industries
    companySize: string;     // ✅ Agregar (company_size desde DB)
}

export interface CreateEntityDto {
    name: string;
    taxId: string;
    industry: number;
    companySize: string;
}

export interface UpdateEntityDto extends Partial<CreateEntityDto> {
    id: number;
}