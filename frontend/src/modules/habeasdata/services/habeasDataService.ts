import { apiClient } from '../../../lib/api-client';
import { useUserStore } from '../../../stores/userStore'
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

export async function getAllDsrs(companyName?: string): Promise<Dsr[]> {
    if (companyName) {
        return apiClient.get<Dsr[]>(`/dsr?companyName=${encodeURIComponent(companyName)}`);
    }
    
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

// ✅ ACTUALIZAR la función getDsrsFiltered

export async function getDsrsFiltered(filters?: DsrFilters): Promise<Dsr[]> {
    const { userData } = useUserStore.getState();
    const companyName = userData?.role === 'superadmin' ? undefined : userData?.nombreEmpresa;

    // Construir query params
    const params = new URLSearchParams();

    if (companyName) {
        params.append('companyName', companyName);
    }

    if (filters?.type) {
        params.append('type', filters.type.toString());
    }

    if (filters?.stage) {
        params.append('stage', filters.stage);
    }

    if (filters?.status) {
        params.append('status', filters.status);
    }

    // Si no hay filtros, usar el endpoint normal
    if (params.toString() === '' || (companyName && params.toString() === `companyName=${encodeURIComponent(companyName)}`)) {
        return getAllDsrs(companyName);
    }

    // Usar el endpoint de filtros
    return apiClient.get<Dsr[]>(`/dsr/filter?${params.toString()}`);
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
    // ✅ CORRECCIÓN: Usar los valores exactos de la DB
    return [
        { value: 'Radicado', label: 'Radicado' },
        { value: 'Reclamo en trámite', label: 'Reclamo en trámite' },
        { value: 'Reclamo en trámite con prórroga', label: 'Reclamo en trámite con prórroga' },
        { value: 'Cerrado', label: 'Cerrado' }
    ];
}
export async function getStatusesForFilter(): Promise<FilterOption[]> {
    return [
        { value: 'Abierto', label: 'Abierto' },
        { value: 'Cerrado', label: 'Cerrado' }
    ];
}