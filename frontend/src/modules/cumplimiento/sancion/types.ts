
// Enums para Sanctions
export enum SanctionStage {
    DecisionInicial = 'DecisionInicial',
    RecursoReposicion = 'RecursoReposicion', 
    RecursoApelacion = 'RecursoApelacion' 
}
export enum SanctionStatus {
    EnTramite = 'EnTramite',
    EnFirme = 'EnFirme' 
}

// Interface completa para Sanction
export interface Sanction {
    id: number;
    number: number;
    entity: number; 
    facts: string;
    stage: SanctionStage;
    status: SanctionStatus;
    initial: string;
    reconsideration: string;
    appeal: string;
}


// DTO para creación de sanction
export interface CreateSanctionDto {
    number: number;
    entity: number;
    facts: string;
    stage: SanctionStage;
    status: SanctionStatus;
    initial: string;
    reconsideration: string;
    appeal: string;
}

// DTO para actualización de sanction
export interface UpdateSanctionDto extends Partial<CreateSanctionDto> {
    id: number;
}