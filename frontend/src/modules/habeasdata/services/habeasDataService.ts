import { apiClient } from '../../../lib/api-client';
import type {
    Dsr,
    CreateDsrDto,
    UpdateDsrDto,
    DsrRequestType,
    DsrStatus,
    FilterOption
} from '../types';

// ============================================
// 📋 CRUD BÁSICO - DSR
// ============================================

export async function getDsrById(id: number): Promise<Dsr> {
    return apiClient.get<Dsr>(`/dsr/${id}`);
}

export async function getAllDsrs(): Promise<Dsr[]> {
    return apiClient.get<Dsr[]>('/dsr');
}

export async function createDsr(data: CreateDsrDto): Promise<Dsr> {
    return apiClient.post<Dsr>('/dsr', data);
}

export async function updateDsr(data: UpdateDsrDto): Promise<Dsr> {
    return apiClient.put<Dsr>(`/dsr/${data.id}`, data);
}

export async function deleteDsr(id: number): Promise<void> {
    return apiClient.delete(`/dsr/${id}`);
}

export async function getDsrByCaseId(caseId: string): Promise<Dsr[]> {
    return apiClient.get<Dsr[]>(`/dsr/case/${caseId}`);
}

export async function getDsrByType(typeId: number): Promise<Dsr[]> {
    return apiClient.get<Dsr[]>(`/dsr/type/${typeId}`);
}

// ============================================
// 📋 CRUD - DSR REQUEST TYPES
// ============================================

export async function getAllRequestTypes(): Promise<DsrRequestType[]> {
    return apiClient.get<DsrRequestType[]>('/dsr/request-types');
}

export async function getRequestTypeById(id: number): Promise<DsrRequestType> {
    return apiClient.get<DsrRequestType>(`/dsr/request-types/${id}`);
}

// ============================================
// 📋 CRUD - DSR STATUSES
// ============================================

export async function getAllStatuses(): Promise<DsrStatus[]> {
    return apiClient.get<DsrStatus[]>('/dsr/statuses');
}

export async function getStatusById(id: number): Promise<DsrStatus> {
    return apiClient.get<DsrStatus>(`/dsr/statuses/${id}`);
}

// ============================================
// 🔍 FILTROS (Preparados para cuando existan los endpoints)
// ============================================

export interface DsrFilters {
    type?: number;
    stage?: string;
    status?: string;
}

export async function getDsrsFiltered(filters?: DsrFilters): Promise<Dsr[]> {
    // Por ahora retornamos todos y filtramos en el cliente
    // Cuando existan los endpoints del backend, se cambiará
    const allDsrs = await getAllDsrs();
    
    if (!filters || Object.keys(filters).length === 0) {
        return allDsrs;
    }

    return allDsrs.filter(dsr => {
        let matches = true;
        
        if (filters.type && dsr.type !== filters.type) {
            matches = false;
        }
        // Los filtros de stage y status se implementarán cuando existan los endpoints
        
        return matches;
    });
}

// ============================================
// 📦 OPCIONES PARA DROPDOWNS DE FILTROS
// ============================================

export async function getTypesForFilter(): Promise<FilterOption[]> {
    const types = await getAllRequestTypes();
    return types.map(t => ({
        value: t.id,
        label: t.type
    }));
}

export async function getStagesForFilter(): Promise<FilterOption[]> {
    // Por ahora retornamos opciones estáticas
    // Se actualizará cuando exista el endpoint
    return [
        { value: 'recibida', label: 'Recibida' },
        { value: 'en_proceso', label: 'En Proceso' },
        { value: 'respondida', label: 'Respondida' },
        { value: 'cerrada', label: 'Cerrada' }
    ];
}

export async function getStatusesForFilter(): Promise<FilterOption[]> {
    const statuses = await getAllStatuses();
    return statuses.map(s => ({
        value: s.id,
        label: s.caseStatus
    }));
}