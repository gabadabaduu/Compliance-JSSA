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
// Cada función trae el DTO real y lo mapea a { id, name }
// ============================================

export async function getRopaSystems(): Promise<RopaLookup[]> {
    const data = await apiClient.get<any[]>('/rat/systems');
    return data.map(s => ({ id: s.id, name: s.systemName || s.name || `Sistema ${s.id}` }));
}

export async function getRopaDataTypes(): Promise<RopaLookup[]> {
    const data = await apiClient.get<any[]>('/rat/datatypes');
    return data.map(d => ({ id: d.id, name: d.typeName || d.name || `Tipo ${d.id}` }));
}

export async function getRopaSubjectCategories(): Promise<RopaLookup[]> {
    const data = await apiClient.get<any[]>('/rat/subjectcategories');
    return data.map(s => ({ id: s.id, name: s.categoryName || s.name || `Categoría ${s.id}` }));
}

export async function getRopaPurposes(): Promise<RopaLookup[]> {
    const data = await apiClient.get<any[]>('/rat/purposes');
    return data.map(p => ({ id: p.id, name: p.purposeName || p.name || `Finalidad ${p.id}` }));
}

export async function getRopaStorage(): Promise<RopaLookup[]> {
    const data = await apiClient.get<any[]>('/rat/data');
    return data.map(s => ({ id: s.id, name: s.dbName || s.name || `Almacenamiento ${s.id}` }));
}

export async function getRopaDataFlow(): Promise<RopaLookup[]> {
    const data = await apiClient.get<any[]>('/rat/dataflow');
    return data.map(d => ({ id: d.id, name: d.flowName || d.name || d.destinationEntity || `Flujo ${d.id}` }));
}

export async function getRopaDepartments(): Promise<RopaLookup[]> {
    const data = await apiClient.get<any[]>('/rat/departments');
    return data.map(d => ({ id: d.id, name: d.departmentName || d.name || `Departamento ${d.id}` }));
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

    // Si no hay filtros activos, traer todo
    const hasActiveFilters = filters && (filters.processOwner || filters.dataCategories || filters.dataShared);
    if (!hasActiveFilters) {
        return getAllRopaTable(companyName);
    }

    const params = new URLSearchParams();
    if (companyName) params.append('companyName', companyName);
    if (filters?.processOwner) params.append('processOwner', filters.processOwner.toString());
    if (filters?.dataCategories) params.append('dataCategories', filters.dataCategories);
    if (filters?.dataShared) params.append('dataShared', filters.dataShared);

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