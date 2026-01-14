
// Enums para Regulations
export enum RegulationStatus {
    Vigente = 'Vigente',
    Compilada = 'Compilada'
}

// Interface completa para Regulation
export interface Regulation {
    id: number;
    type: number; 
    number: number;
    issueDate: Date;
    year: number;
    regulation: string;
    commonName: string;
    industry: number; 
    authority: number;
    title: string;
    domain: number; 
    status: RegulationStatus;
    url: string;
}


export interface CreateRegulationDto {
    type: number;
    number: number;
    issueDate: Date;
    year: number;
    regulation: string;
    commonName: string;
    industry: number;
    authority: number;
    title: string;
    domain: number;
    status: RegulationStatus;
    url: string;
}

// DTO para actualización de regulation
export interface UpdateRegulationDto extends Partial<CreateRegulationDto> {
    id: number;
}