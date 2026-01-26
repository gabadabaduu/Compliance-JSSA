import { apiClient } from '../../../../lib/api-client';
import { useUserStore } from '../../../../stores/userStore';
import type {
    Resolution,
    CreateResolutionDto,
    UpdateResolutionDto,
    ResolutionOutcome,
    SanctionType,
    Infringement
} from '../types';

// ============================================
// 📋 CRUD BÁSICO
// ============================================

export async function getResolutionById(id: number): Promise<Resolution> {
    return apiClient.get<Resolution>(`/Resolutions/${id}`);
}

export async function getAllResolutions(): Promise<Resolution[]> {
    return apiClient.get<Resolution[]>('/Resolutions');
}

export async function createResolution(data: CreateResolutionDto): Promise<Resolution> {
    const { userData } = useUserStore.getState();
    
    if (userData?.role !== 'superadmin') {
        throw new Error('No tienes permisos para crear resoluciones');
    }
    
    return apiClient.post<Resolution>('/Resolutions', data);
}

export async function updateResolution(data: UpdateResolutionDto): Promise<Resolution> {
    const { userData } = useUserStore.getState();
    
    if (userData?.role !== 'superadmin') {
        throw new Error('No tienes permisos para actualizar resoluciones');
    }
    
    return apiClient.put<Resolution>(`/Resolutions/${data.id}`, data);
}

export async function deleteResolution(id: number): Promise<void> {
    const { userData } = useUserStore.getState();
    
    if (userData?.role !== 'superadmin') {
        throw new Error('No tienes permisos para eliminar resoluciones');
    }
    
    return apiClient.delete(`/Resolutions/${id}`);
}

// ============================================
// 🔍 FILTROS
// ============================================

export interface ResolutionFilters {
    sanctions?: string;
    issueDate?: string;
    year?: number;
    resolutionType?: string;
    infringements?: number;
    sanctionType?: number;
    outcome?: string;
}

export async function getResolutionsFiltered(filters?: ResolutionFilters): Promise<Resolution[]> {
    if (!filters || Object.keys(filters).length === 0) {
        return getAllResolutions();
    }

    const params = new URLSearchParams();
    
    if (filters.sanctions) params.append('sanctions', filters.sanctions);
    if (filters.issueDate) params.append('issueDate', filters.issueDate);
    if (filters.year) params.append('year', filters.year.toString());
    if (filters.resolutionType) params.append('resolutionType', filters.resolutionType);
    if (filters.infringements) params.append('infringements', filters.infringements.toString());
    if (filters.sanctionType) params.append('sanctionType', filters.sanctionType.toString());
    if (filters.outcome) params.append('outcome', filters.outcome);

    const queryString = params.toString();
    return apiClient.get<Resolution[]>(`/Resolutions/filter?${queryString}`);
}

// ============================================
// 📦 OPCIONES PARA DROPDOWNS DE FILTROS
// ============================================

export async function getSanctionsForFilter(): Promise<Array<{ value: string; label: string }>> {
    const sanctions = await apiClient.get<Array<{ id: number; number: number }>>('/Sancion');
    return sanctions.map(s => ({ value: s.id.toString(), label: `Sanción #${s.number}` }));
}

export async function getYearsForFilter(): Promise<Array<{ value: number; label: string }>> {
    const resolutions = await apiClient.get<Resolution[]>('/Resolutions');
    const years = [...new Set(resolutions.map(r => r.year))].sort((a, b) => b - a);
    return years.map(y => ({ value: y, label: y.toString() }));
}

export async function getResolutionTypesForFilter(): Promise<Array<{ value: string; label: string }>> {
    const resolutions = await apiClient.get<Resolution[]>('/Resolutions');
    const types = [...new Set(resolutions.map(r => r.resolutionType).filter(Boolean))];
    return types.map(t => ({ value: t, label: t }));
}

export async function getInfringementsForFilter(): Promise<Array<{ value: number; label: string }>> {
    const infringements = await apiClient.get<Infringement[]>('/Resolutions/catalog/infringements');
    return infringements.map(i => ({ value: i.id, label: `${i.article} - ${i.section}` }));
}

export async function getSanctionTypesForFilter(): Promise<Array<{ value: number; label: string }>> {
    const types = await apiClient.get<SanctionType[]>('/Resolutions/catalog/sanction-types');
    return types.map(t => ({ value: t.id, label: t.name }));
}

export async function getOutcomesForFilter(): Promise<Array<{ value: string; label: string }>> {
    return [
        { value: 'Acogida', label: 'Acogida' },
        { value: 'No Acogida', label: 'No Acogida' },
        { value: 'Parcialmente Acogida', label: 'Parcialmente Acogida' }
    ];
}