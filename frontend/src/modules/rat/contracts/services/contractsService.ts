import { apiClient } from '../../../../lib/api-client';
import { useUserStore } from '../../../../stores/userStore';
import type {
    RopaContract,
    CreateRopaContractDto,
    UpdateRopaContractDto,
    RopaEntityRef,
    FilterOption
} from '../types';

// ============================================
// 📋 CRUD BÁSICO - ROPA CONTRACTS
// ============================================

export async function getContractById(id: number): Promise<RopaContract> {
    return apiClient.get<RopaContract>(`/rat/contracts/${id}`);
}

export async function getAllContracts(companyName?: string): Promise<RopaContract[]> {
    if (companyName) {
        return apiClient.get<RopaContract[]>(`/rat/contracts?companyName=${encodeURIComponent(companyName)}`);
    }
    return apiClient.get<RopaContract[]>('/rat/contracts');
}

export async function createContract(data: CreateRopaContractDto): Promise<RopaContract> {
    return apiClient.post<RopaContract>('/rat/contracts', data);
}

export async function updateContract(data: UpdateRopaContractDto): Promise<RopaContract> {
    return apiClient.put<RopaContract>(`/rat/contracts/${data.id}`, data);
}

export async function deleteContract(id: number): Promise<void> {
    return apiClient.delete(`/rat/contracts/${id}`);
}

export async function getContractsByEntityId(entityId: number): Promise<RopaContract[]> {
    return apiClient.get<RopaContract[]>(`/rat/contracts/entity/${entityId}`);
}

// ============================================
// 📋 ENTIDADES (para dropdown de selección)
// ============================================

export async function getAllEntities(): Promise<RopaEntityRef[]> {
    return apiClient.get<RopaEntityRef[]>('/rat/entities');
}

// ============================================
// 🔍 FILTROS
// ============================================

export interface ContractFilters {
    contractType?: string;
    status?: string;
}

export async function getContractsFiltered(filters?: ContractFilters): Promise<RopaContract[]> {
    const { userData } = useUserStore.getState();
    const companyName = userData?.role === 'superadmin' ? undefined : userData?.nombreEmpresa;

    // Construir query params
    const params = new URLSearchParams();

    if (companyName) {
        params.append('companyName', companyName);
    }

    if (filters?.contractType) {
        params.append('contractType', filters.contractType);
    }

    if (filters?.status) {
        params.append('status', filters.status);
    }

    // Si no hay filtros, usar el endpoint normal
    if (params.toString() === '' || (companyName && params.toString() === `companyName=${encodeURIComponent(companyName)}`)) {
        return getAllContracts(companyName);
    }

    // Usar el endpoint de filtros
    return apiClient.get<RopaContract[]>(`/rat/contracts/filter?${params.toString()}`);
}

// ============================================
// 📦 OPCIONES PARA DROPDOWNS DE FILTROS
// ============================================

export async function getContractTypesForFilter(): Promise<FilterOption[]> {
    // Valores posibles de contract_type - ajustar según tu negocio
    return [
        { value: 'Encargado', label: 'Encargado' },
        { value: 'Transmisión', label: 'Transmisión' },
        { value: 'Transferencia', label: 'Transferencia' },
        { value: 'Subencargado', label: 'Subencargado' },
        { value: 'Otro', label: 'Otro' },
    ];
}

export async function getContractStatusesForFilter(): Promise<FilterOption[]> {
    return [
        { value: 'Vigente', label: 'Vigente' },
        { value: 'Vencido', label: 'Vencido' },
        { value: 'En revisión', label: 'En revisión' },
        { value: 'Cancelado', label: 'Cancelado' },
    ];
}