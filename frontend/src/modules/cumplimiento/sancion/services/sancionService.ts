import { apiClient } from '../../../../lib/api-client';
import type {
    Sanction,
    CreateSanctionDto,
    UpdateSanctionDto
} from '../types';

// Obtener sanction por ID
export async function getSanctionById(id: number): Promise<Sanction> {
    return apiClient.get<Sanction>(`/Sancion/${id}`);
}

// Obtener todas las sanctions
export async function getAllSanctions(): Promise<Sanction[]> {
    return apiClient.get<Sanction[]>('/Sancion');
}

// Crear nueva sanction
export async function createSanction(data: CreateSanctionDto): Promise<Sanction> {
    return apiClient.post<Sanction>('/Sancion', data);
}

// Actualizar sanction existente
export async function updateSanction(data: UpdateSanctionDto): Promise<Sanction> {
    return apiClient.put<Sanction>(`/Sancion/${data.id}`, data);
}

// Eliminar sanction
export async function deleteSanction(id: number): Promise<void> {
    return apiClient.delete(`/Sancion/${id}`);
}

// Filtrar sanctions por status
export async function getSanctionsByStatus(status: string): Promise<Sanction[]> {
    return apiClient.get<Sanction[]>(`/Sancion/status/${status}`);
}

// Filtrar sanctions por stage
export async function getSanctionsByStage(stage: string): Promise<Sanction[]> {
    return apiClient.get<Sanction[]>(`/Sancion/stage/${stage}`);
}

// Filtrar sanctions por entity
export async function getSanctionsByEntity(entityId: number): Promise<Sanction[]> {
    return apiClient.get<Sanction[]>(`/Sancion/entity/${entityId}`);
}