import { apiClient } from '../../../../lib/api-client';
import { useUserStore } from '../../../../stores/userStore';
import type {
    RopaTable,
    CreateRopaTableDto,
    UpdateRopaTableDto,
    RopaLookup,
    FilterOption,
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
    ];
}

// ============================================
// 🔍 DATAFLOW
// ============================================

export interface RopaDataFlowDto {
    id: number;
    processingActivityId?: number | null;
    entityId?: number | null;
    entityRole: string;
    country?: string | null;
    parentEntity?: string | null;
    dataAgreement?: string | null;
    // optional name fields that backend may return
    processingActivityName?: string | null;
    entityName?: string | null;
    parentEntityName?: string | null;
    countryName?: string | null;
    dataAgreementName?: string | null;
    createdBy?: string | null;
    updatedBy?: string | null;
}

export async function getAllRopaDataFlows(): Promise<RopaDataFlowDto[]> {
    return apiClient.get<RopaDataFlowDto[]>('/rat/dataflow');
}

// Para POST: omitimos 'id' y campos de auditoría
export type CreateRopaDataFlowDto = Omit<RopaDataFlowDto, 'id' | 'createdBy' | 'updatedBy'>;

export async function createRopaDataFlow(dto: CreateRopaDataFlowDto): Promise<RopaDataFlowDto> {
    const res = await apiClient.post<RopaDataFlowDto>('/rat/dataflow', dto);
    // apiClient puede devolver directamente el body o un objeto tipo axios.
    // Manejamos ambos casos:
    if (res && typeof (res as any).data !== 'undefined') {
        return (res as any).data as RopaDataFlowDto;
    }
    return res as unknown as RopaDataFlowDto;
}

// UPDATE (PUT) para Dataflow
export async function updateRopaDataFlow(dto: RopaDataFlowDto): Promise<RopaDataFlowDto> {
    const res = await apiClient.put<RopaDataFlowDto>(`/rat/dataflow/${dto.id}`, dto);
    if (res && typeof (res as any).data !== 'undefined') {
        return (res as any).data as RopaDataFlowDto;
    }
    return res as unknown as RopaDataFlowDto;
}

// DELETE para Dataflow
export async function deleteRopaDataFlow(id: number): Promise<void> {
    await apiClient.delete(`/rat/dataflow/${id}`);
}

// ============================================
// 🔍 LOOKUPS para Dataflow: entidades y contratos
// Ajusta rutas si tu API usa paths distintos
// ============================================

export interface RopaEntityDto {
    id: number;
    name: string;
}

export interface RopaContractDto {
    id: number;
    name: string;
}

export async function getAllRopaEntities(): Promise<RopaEntityDto[]> {
    const res = await apiClient.get<any[]>('/rat/entities');
    return (res ?? []).map((e: any) => ({
        id: Number(e.id),
        name: e.name ?? e.entityName ?? e.legalName ?? `Entidad ${e.id}`,
    }));
}

export async function getAllRopaContracts(): Promise<RopaContractDto[]> {
    const res = await apiClient.get<any[]>('/rat/contracts');
    return (res ?? []).map((c: any) => ({
        id: Number(c.id),
        name: c.name ?? c.contractName ?? c.title ?? c.agreementName ?? `Contrato ${c.id}`,
    }));
}