import { apiClient } from '../../../../lib/api-client';
import type {
    Resolution,
    CreateResolutionDto,
    UpdateResolutionDto
} from '../types';

// Obtener resolution por ID
export async function getResolutionById(id: number): Promise<Resolution> {
    return apiClient.get<Resolution>(`/Resolutions/${id}`);
}

// Obtener todas las resolutions
export async function getAllResolutions(): Promise<Resolution[]> {
    return apiClient.get<Resolution[]>('/Resolutions');
}

// Crear nueva resolution
export async function createResolution(data: CreateResolutionDto): Promise<Resolution> {
    return apiClient.post<Resolution>('/Resolutions', data);
}

// Actualizar resolution existente
export async function updateResolution(data: UpdateResolutionDto): Promise<Resolution> {
    return apiClient.put<Resolution>(`/Resolutions/${data.id}`, data);
}

// Eliminar resolution
export async function deleteResolution(id: number): Promise<void> {
    return apiClient.delete(`/Resolutions/${id}`);
}

// Filtrar resolutions por outcome
export async function getResolutionsByOutcome(outcome: string): Promise<Resolution[]> {
    return apiClient.get<Resolution[]>(`/Resolutions/outcome/${outcome}`);
}

// Buscar resolutions por año
export async function getResolutionsByYear(year: number): Promise<Resolution[]> {
    return apiClient.get<Resolution[]>(`/Resolutions/year/${year}`);
}
export async function getAllRegulations(): Promise<any[]> {
    return apiClient.get<any[]>('/Normativa');
}