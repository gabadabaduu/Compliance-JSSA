import { apiClient } from '../../../../lib/api-client';
import type {
    Regulation,
    CreateRegulationDto,
    UpdateRegulationDto,
    CatalogItem
} from '../types';

// ============================================
// 📋 CRUD BÁSICO
// ============================================

export async function getRegulationById(id: number): Promise<Regulation> {
    return apiClient.get<Regulation>(`/Normativa/${id}`);
}

export async function getAllRegulations(): Promise<Regulation[]> {
    return apiClient.get<Regulation[]>('/Normativa');
}

export async function createRegulation(data: CreateRegulationDto): Promise<Regulation> {
    return apiClient.post<Regulation>('/Normativa', data);
}

export async function updateRegulation(data: UpdateRegulationDto): Promise<Regulation> {
    return apiClient.put<Regulation>(`/Normativa/${data.id}`, data);
}

export async function deleteRegulation(id: number): Promise<void> {
    return apiClient.delete(`/Normativa/${id}`);
}

// ============================================
// 🔍 FILTROS
// ============================================

export interface RegulationFilters {
    type?: number;
    issueDate?: string;
    year?: number;
    regulation?: string;
    authority?: number;
    industry?: number;
    domain?: number;
    status?: string;
}

export async function getRegulationsFiltered(filters?: RegulationFilters): Promise<Regulation[]> {
    if (!filters || Object.keys(filters).length === 0) {
        return getAllRegulations();
    }

    const params = new URLSearchParams();
    
    if (filters.type) params.append('type', filters.type.toString());
    if (filters.issueDate) params.append('issueDate', filters.issueDate);
    if (filters.year) params.append('year', filters.year.toString());
    if (filters.regulation) params.append('regulation', filters.regulation);
    if (filters.authority) params.append('authority', filters.authority.toString());
    if (filters.industry) params.append('industry', filters.industry.toString());
    if (filters.domain) params.append('domain', filters.domain.toString());
    if (filters.status) params.append('status', filters.status);

    const queryString = params.toString();
    return apiClient.get<Regulation[]>(`/Normativa/filter?${queryString}`);
}

// ============================================
// 📦 OPCIONES PARA DROPDOWNS DE FILTROS
// ============================================

export async function getTypesForFilter(): Promise<Array<{ value: number; label: string }>> {
    const types = await apiClient.get<CatalogItem[]>('/Normativa/catalog/types');
    return types.map(t => ({ value: t.id, label: t.name }));
}

export async function getYearsForFilter(): Promise<Array<{ value: number; label: string }>> {
    const regulations = await apiClient.get<Regulation[]>('/Normativa');
    const years = [...new Set(regulations.map(r => r.year))].sort((a, b) => b - a);
    return years.map(y => ({ value: y, label: y.toString() }));
}

export async function getAuthoritiesForFilter(): Promise<Array<{ value: number; label: string }>> {
    const authorities = await apiClient.get<CatalogItem[]>('/Normativa/catalog/authorities');
    return authorities.map(a => ({ value: a.id, label: a.name }));
}

export async function getIndustriesForFilter(): Promise<Array<{ value: number; label: string }>> {
    const industries = await apiClient.get<CatalogItem[]>('/Normativa/catalog/industries');
    return industries.map(i => ({ value: i.id, label: i.name }));
}

export async function getDomainsForFilter(): Promise<Array<{ value: number; label: string }>> {
    const domains = await apiClient.get<CatalogItem[]>('/Normativa/catalog/domains');
    return domains.map(d => ({ value: d.id, label: d.name }));
}

export async function getStatusesForFilter(): Promise<Array<{ value: string; label: string }>> {
    return [
        { value: 'Vigente', label: 'Vigente' },
        { value: 'Compilada', label: 'Compilada' }
    ];
}