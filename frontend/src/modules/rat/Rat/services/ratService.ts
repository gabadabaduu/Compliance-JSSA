import { apiClient } from '../../../../lib/api-client';
import { useUserStore } from '../../../../stores/userStore';
import type {
    RopaTable,
    CreateRopaTableDto,
    UpdateRopaTableDto,
    RopaLookup,
    FilterOption
} from '../types';

// ============================================
// 📋 CRUD - ROPA TABLE
// ============================================

export async function getAllRopaTable(companyName?: string): Promise<RopaTable[]> {
    if (companyName) {
        return apiClient.get<RopaTable[]>(`/rat/table?companyName=${encodeURIComponent(companyName)}`);
    }
    return apiClient.get<RopaTable[]>('/rat/table');
}

export async function getRopaTableById(id: number): Promise<RopaTable> {
    return apiClient.get<RopaTable>(`/rat/table/${id}`);
}

export async function createRopaTable(data: CreateRopaTableDto): Promise<RopaTable> {
    return apiClient.post<RopaTable>('/rat/table', data);
}

export async function updateRopaTable(data: UpdateRopaTableDto): Promise<RopaTable> {
    return apiClient.put<RopaTable>(`/rat/table/${data.id}`, data);
}

export async function deleteRopaTable(id: number): Promise<void> {
    return apiClient.delete(`/rat/table/${id}`);
}

// ============================================
// 📋 LOOKUPS (dropdowns de FK)
// ============================================

export async function getRopaSystems(): Promise<RopaLookup[]> {
    return apiClient.get<RopaLookup[]>('/rat/table/lookups/systems');
}

export async function getRopaDataTypes(): Promise<RopaLookup[]> {
    return apiClient.get<RopaLookup[]>('/rat/table/lookups/datatypes');
}

export async function getRopaSubjectCategories(): Promise<RopaLookup[]> {
    return apiClient.get<RopaLookup[]>('/rat/table/lookups/subjectcategories');
}

export async function getRopaPurposes(): Promise<RopaLookup[]> {
    return apiClient.get<RopaLookup[]>('/rat/table/lookups/purposes');
}

export async function getRopaStorage(): Promise<RopaLookup[]> {
    return apiClient.get<RopaLookup[]>('/rat/table/lookups/storage');
}

export async function getRopaDataFlow(): Promise<RopaLookup[]> {
    return apiClient.get<RopaLookup[]>('/rat/table/lookups/dataflow');
}

export async function getRopaDepartments(): Promise<RopaLookup[]> {
    return apiClient.get<RopaLookup[]>('/rat/table/lookups/departments');
}

// ============================================
// 🔍 FILTROS
// ============================================

export interface RopaTableFilters {
    processOwner?: number;
    dataCategories?: string;
    dataShared?: string;
}

export async function getRopaTableFiltered(filters?: RopaTableFilters): Promise<RopaTable[]> {
    const { userData } = useUserStore.getState();
    const companyName = userData?.role === 'superadmin' ? undefined : userData?.nombreEmpresa;

    const params = new URLSearchParams();

    if (companyName) params.append('companyName', companyName);
    if (filters?.processOwner) params.append('processOwner', filters.processOwner.toString());
    if (filters?.dataCategories) params.append('dataCategories', filters.dataCategories);
    if (filters?.dataShared) params.append('dataShared', filters.dataShared);

    if (params.toString() === '' || (companyName && params.toString() === `companyName=${encodeURIComponent(companyName)}`)) {
        return getAllRopaTable(companyName);
    }

    return apiClient.get<RopaTable[]>(`/rat/table/filter?${params.toString()}`);
}

export async function getProcessOwnerFilterOptions(): Promise<FilterOption[]> {
    const departments = await getRopaDepartments();
    return departments.map(d => ({ value: d.id, label: d.name }));
}

export async function getDataCategoriesFilterOptions(): Promise<FilterOption[]> {
    return [
        { value: 'Pública', label: 'Pública' },
        { value: 'Privada', label: 'Privada' },
        { value: 'Semiprivada', label: 'Semiprivada' },
        { value: 'Sensible', label: 'Sensible' },
    ];
}

export async function getDataSharedFilterOptions(): Promise<FilterOption[]> {
    return [
        { value: 'Sí', label: 'Sí' },
        { value: 'No', label: 'No' },
        { value: 'Parcialmente', label: 'Parcialmente' },
    ];
}