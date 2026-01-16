import { apiClient } from '../../../../lib/api-client';
import type {
    Regulation,
    CreateRegulationDto,
    UpdateRegulationDto
} from '../types';

// Obtener regulation por ID
export async function getRegulationById(id: number): Promise<Regulation> {
    return apiClient.get<Regulation>(`/Normativa/${id}`);
}

// Obtener todas las regulations
export async function getAllRegulations(): Promise<Regulation[]> {
    return apiClient.get<Regulation[]>('/Normativa');
}

// Crear nueva regulation
export async function createRegulation(data: CreateRegulationDto): Promise<Regulation> {
    return apiClient.post<Regulation>('/Normativa', data);
}

// Actualizar regulation existente
export async function updateRegulation(data: UpdateRegulationDto): Promise<Regulation> {
    return apiClient.put<Regulation>(`/Normativa/${data.id}`, data);
}

// Eliminar regulation
export async function deleteRegulation(id: number): Promise<void> {
    return apiClient.delete(`/Normativa/${id}`);
}

// Filtrar regulations por status
export async function getRegulationsByStatus(status: string): Promise<Regulation[]> {
    return apiClient.get<Regulation[]>(`/Normativa/status/${status}`);
}

// Buscar regulations por año
export async function getRegulationsByYear(year: number): Promise<Regulation[]> {
    return apiClient.get<Regulation[]>(`/Normativa/year/${year}`);
}