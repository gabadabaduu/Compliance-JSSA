import { apiClient } from '../../../../lib/api-client';
import { useUserStore } from '../../../../stores/userStore';
import type {
    RopaEntity,
    CreateRopaEntityDto,
    UpdateRopaEntityDto,
    ContactChannel,
    FilterOption
} from '../types';

// ============================================
// 📋 CRUD BÁSICO - ROPA ENTITIES
// ============================================

export async function getEntityById(id: number): Promise<RopaEntity> {
    return apiClient.get<RopaEntity>(`/rat/entities/${id}`);
}

export async function getAllEntities(companyName?: string): Promise<RopaEntity[]> {
    if (companyName) {
        return apiClient.get<RopaEntity[]>(`/rat/entities?companyName=${encodeURIComponent(companyName)}`);
    }
    return apiClient.get<RopaEntity[]>('/rat/entities');
}

export async function createEntity(data: CreateRopaEntityDto): Promise<RopaEntity> {
    return apiClient.post<RopaEntity>('/rat/entities', data);
}

export async function updateEntity(data: UpdateRopaEntityDto): Promise<RopaEntity> {
    return apiClient.put<RopaEntity>(`/rat/entities/${data.id}`, data);
}

export async function deleteEntity(id: number): Promise<void> {
    return apiClient.delete(`/rat/entities/${id}`);
}

export async function getEntitiesByType(type: string): Promise<RopaEntity[]> {
    return apiClient.get<RopaEntity[]>(`/rat/entities/type/${encodeURIComponent(type)}`);
}

// ============================================
// 📋 CONTACT CHANNELS (para dropdown)
// ============================================

export async function getAllContactChannels(): Promise<ContactChannel[]> {
    return apiClient.get<ContactChannel[]>('/rat/contact-channels');
}

// ============================================
// 🔍 FILTROS
// ============================================

export interface EntityFilters {
    country?: string;
}

export async function getEntitiesFiltered(filters?: EntityFilters): Promise<RopaEntity[]> {
    const { userData } = useUserStore.getState();
    const companyName = userData?.role === 'superadmin' ? undefined : userData?.nombreEmpresa;

    // Construir query params
    const params = new URLSearchParams();

    if (companyName) {
        params.append('companyName', companyName);
    }

    if (filters?.country) {
        params.append('country', filters.country);
    }

    // Si no hay filtros, usar el endpoint normal
    if (params.toString() === '' || (companyName && params.toString() === `companyName=${encodeURIComponent(companyName)}`)) {
        return getAllEntities(companyName);
    }

    // Usar el endpoint de filtros
    return apiClient.get<RopaEntity[]>(`/rat/entities/filter?${params.toString()}`);
}

// ============================================
// 📦 OPCIONES PARA DROPDOWNS DE FILTROS
// ============================================

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