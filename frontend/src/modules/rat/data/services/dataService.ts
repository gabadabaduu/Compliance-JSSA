import { apiClient } from '../../../../lib/api-client';
import { useUserStore } from '../../../../stores/userStore';
import type {
    RopaDataStorage,
    CreateRopaDataStorageDto,
    UpdateRopaDataStorageDto,
    RopaDepartment,
    FilterOption
} from '../types';

// ============================================
// 📋 CRUD BÁSICO - ROPA DATA STORAGE
// ============================================

export async function getDataStorageById(id: number): Promise<RopaDataStorage> {
    return apiClient.get<RopaDataStorage>(`/rat/data/${id}`);
}

export async function getAllDataStorages(companyName?: string): Promise<RopaDataStorage[]> {
    if (companyName) {
        return apiClient.get<RopaDataStorage[]>(`/rat/data?companyName=${encodeURIComponent(companyName)}`);
    }
    return apiClient.get<RopaDataStorage[]>('/rat/data');
}

export async function createDataStorage(data: CreateRopaDataStorageDto): Promise<RopaDataStorage> {
    return apiClient.post<RopaDataStorage>('/rat/data', data);
}

export async function updateDataStorage(data: UpdateRopaDataStorageDto): Promise<RopaDataStorage> {
    return apiClient.put<RopaDataStorage>(`/rat/data/${data.id}`, data);
}

export async function deleteDataStorage(id: number): Promise<void> {
    return apiClient.delete(`/rat/data/${id}`);
}

export async function getDataStorageByCustodian(custodianId: number): Promise<RopaDataStorage[]> {
    return apiClient.get<RopaDataStorage[]>(`/rat/data/custodian/${custodianId}`);
}

// ============================================
// 📋 DEPARTAMENTOS (para dropdown de custodian)
// ============================================

export async function getAllDepartments(): Promise<RopaDepartment[]> {
    return apiClient.get<RopaDepartment[]>('/rat/departments');
}

// ============================================
// 🔍 FILTROS
// ============================================

export interface DataStorageFilters {
    processingMode?: string;
    country?: string;
}

export async function getDataStoragesFiltered(filters?: DataStorageFilters): Promise<RopaDataStorage[]> {
    const { userData } = useUserStore.getState();
    const companyName = userData?.role === 'superadmin' ? undefined : userData?.nombreEmpresa;

    // Construir query params
    const params = new URLSearchParams();

    if (companyName) {
        params.append('companyName', companyName);
    }

    if (filters?.processingMode) {
        params.append('processingMode', filters.processingMode);
    }

    if (filters?.country) {
        params.append('country', filters.country);
    }

    // Si no hay filtros, usar el endpoint normal
    if (params.toString() === '' || (companyName && params.toString() === `companyName=${encodeURIComponent(companyName)}`)) {
        return getAllDataStorages(companyName);
    }

    // Usar el endpoint de filtros
    return apiClient.get<RopaDataStorage[]>(`/rat/data/filter?${params.toString()}`);
}

// ============================================
// 📦 OPCIONES PARA DROPDOWNS DE FILTROS
// ============================================

export async function getProcessingModesForFilter(): Promise<FilterOption[]> {
    return [
        { value: 'Manual', label: 'Manual' },
        { value: 'Automatizado', label: 'Automatizado' },
        { value: 'Mixto', label: 'Mixto' },
    ];
}

export async function getCountriesForFilter(): Promise<FilterOption[]> {
    return [
        { value: 'Colombia', label: 'Colombia' },
        { value: 'México', label: 'México' },
        { value: 'Argentina', label: 'Argentina' },
        { value: 'Chile', label: 'Chile' },
        { value: 'Perú', label: 'Perú' },
        { value: 'Ecuador', label: 'Ecuador' },
        { value: 'Brasil', label: 'Brasil' },
        { value: 'Estados Unidos', label: 'Estados Unidos' },
        { value: 'España', label: 'España' },
        { value: 'Otro', label: 'Otro' },
    ];
}