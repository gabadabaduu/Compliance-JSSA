import { apiClient } from '../../../../lib/api-client';
import type {
    Sanction,
    CreateSanctionDto,
    UpdateSanctionDto,
    SanctionStatus,
    SanctionStage,
    Entity
} from '../types';

// ============================================
// 📋 CRUD BÁSICO
// ============================================

export async function getSanctionById(id: number): Promise<Sanction> {
    return apiClient.get<Sanction>(`/Sancion/${id}`);
}

export async function getAllSanctions(): Promise<Sanction[]> {
    return apiClient.get<Sanction[]>('/Sancion');
}

export async function createSanction(data: CreateSanctionDto): Promise<Sanction> {
    return apiClient.post<Sanction>('/Sancion', data);
}

export async function updateSanction(data: UpdateSanctionDto): Promise<Sanction> {
    return apiClient.put<Sanction>(`/Sancion/${data.id}`, data);
}

export async function deleteSanction(id: number): Promise<void> {
    return apiClient.delete(`/Sancion/${id}`);
}

// ============================================
// 🔍 FILTROS
// ============================================

export interface SanctionFilters {
    entity?: number;
    stage?: string;
    initial?: number;
    reconsideration?: number;
    appeal?: number;
}

export async function getSanctionsFiltered(filters?: SanctionFilters): Promise<Sanction[]> {
    if (!filters || Object.keys(filters).length === 0) {
        return getAllSanctions();
    }

    const params = new URLSearchParams();
    
    if (filters.entity) params.append('entity', filters.entity.toString());
    if (filters.stage) params.append('stage', filters.stage);
    if (filters.initial) params.append('initial', filters.initial.toString());
    if (filters.reconsideration) params.append('reconsideration', filters.reconsideration.toString());
    if (filters.appeal) params.append('appeal', filters.appeal.toString());

    const queryString = params.toString();
    return apiClient.get<Sanction[]>(`/Sancion/filter?${queryString}`);
}

// ============================================
// 📦 OPCIONES PARA DROPDOWNS DE FILTROS
// ============================================

export async function getEntitiesForFilter(): Promise<Array<{ value: number; label: string }>> {
    const entities = await apiClient.get<Entity[]>('/Sanctions/catalog/entities');
    return entities.map(e => ({ value: e.id, label: e.name }));
}

export async function getResolutionsForFilter(): Promise<Array<{ value: number; label: string }>> {
    const resolutions = await apiClient.get<Array<{ id: number; number: number }>>('/Resolutions');
    return resolutions.map(r => ({ value: r.id, label: `Resolución #${r.number}` }));
}