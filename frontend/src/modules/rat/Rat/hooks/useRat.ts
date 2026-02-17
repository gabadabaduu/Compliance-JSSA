import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAllRopaTable,
    getRopaTableById,
    createRopaTable,
    updateRopaTable,
    deleteRopaTable,
    getRopaTableFiltered,
    getRopaSystems,
    getRopaDataTypes,
    getRopaSubjectCategories,
    getRopaPurposes,
    getRopaStorage,
    getRopaDataFlow,
    getAllRopaDataFlows,
    createRopaDataFlow,
    updateRopaDataFlow,
    deleteRopaDataFlow,
    getRopaDepartments,
    getProcessOwnerFilterOptions,
    getDataCategoriesFilterOptions,
    getDataSharedFilterOptions,
    getAllRopaEntities,
    getAllRopaContracts,
    type RopaTableFilters,
    type RopaDataFlowDto,
    type CreateRopaDataFlowDto,
    type RopaEntityDto,
    type RopaContractDto,
} from '../services/ratService';
import type { CreateRopaTableDto, UpdateRopaTableDto } from '../types';
import { useUserStore } from '../../../../stores/userStore';
import { usePermissions } from '../../../../hooks/usePermissions';

// ============================================
// 📋 HOOKS CRUD
// ============================================

export function useRopaTable() {
    const { isSuperAdmin } = usePermissions();
    const { userData } = useUserStore();
    const companyName = isSuperAdmin ? undefined : userData?.nombreEmpresa;

    return useQuery({
        queryKey: ['ropa-table', companyName],
        queryFn: () => getAllRopaTable(companyName),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

export function useRopaTableItem(id: number) {
    return useQuery({
        queryKey: ['ropa-table', id],
        queryFn: () => getRopaTableById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

export function useCreateRopaTable() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateRopaTableDto) => createRopaTable(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ropa-table'] });
        },
    });
}

export function useUpdateRopaTable() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateRopaTableDto) => updateRopaTable(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['ropa-table'] });
            queryClient.invalidateQueries({ queryKey: ['ropa-table', (variables as any).id] });
        },
    });
}

export function useDeleteRopaTable() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteRopaTable(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ropa-table'] });
        },
    });
}

export function useRopaDataFlows() {
    return useQuery<RopaDataFlowDto[], Error>({
        queryKey: ['ropa-lookups', 'dataflows'],
        queryFn: getAllRopaDataFlows,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

export function useCreateRopaDataFlow() {
    const queryClient = useQueryClient();
    return useMutation<RopaDataFlowDto, Error, CreateRopaDataFlowDto>({
        mutationFn: (dto: CreateRopaDataFlowDto) => createRopaDataFlow(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ropa-lookups', 'dataflows'] });
            queryClient.invalidateQueries({ queryKey: ['ropa-table'] });
        },
    });
}

// Nuevo: update mutation para dataflow
export function useUpdateRopaDataFlow() {
    const queryClient = useQueryClient();
    return useMutation<RopaDataFlowDto, Error, RopaDataFlowDto>({
        mutationFn: (dto: RopaDataFlowDto) => updateRopaDataFlow(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ropa-lookups', 'dataflows'] });
            queryClient.invalidateQueries({ queryKey: ['ropa-table'] });
        },
    });
}

// Nuevo: delete mutation para dataflow
export function useDeleteRopaDataFlow() {
    const queryClient = useQueryClient();
    return useMutation<void, Error, number>({
        mutationFn: (id: number) => deleteRopaDataFlow(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ropa-lookups', 'dataflows'] });
            queryClient.invalidateQueries({ queryKey: ['ropa-table'] });
        },
    });
}

// ============================================
// 📋 LOOKUPS (dropdowns)
// ============================================

export function useRopaSystems() {
    return useQuery({
        queryKey: ['ropa-lookups', 'systems'],
        queryFn: getRopaSystems,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

export function useRopaDataTypes() {
    return useQuery({
        queryKey: ['ropa-lookups', 'datatypes'],
        queryFn: getRopaDataTypes,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

export function useRopaSubjectCategories() {
    return useQuery({
        queryKey: ['ropa-lookups', 'subjectcategories'],
        queryFn: getRopaSubjectCategories,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

export function useRopaPurposes() {
    return useQuery({
        queryKey: ['ropa-lookups', 'purposes'],
        queryFn: getRopaPurposes,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

export function useRopaStorageLookup() {
    return useQuery({
        queryKey: ['ropa-lookups', 'storage'],
        queryFn: getRopaStorage,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

export function useRopaDataFlow() {
    return useQuery({
        queryKey: ['ropa-lookups', 'dataflow'],
        queryFn: getRopaDataFlow,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

export function useRopaDepartments() {
    return useQuery({
        queryKey: ['ropa-lookups', 'departments'],
        queryFn: getRopaDepartments,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

// New: entities & contracts lookups
export function useRopaEntities() {
    return useQuery<RopaEntityDto[], Error>({
        queryKey: ['ropa-lookups', 'entities'],
        queryFn: getAllRopaEntities,
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60,
    });
}

export function useRopaContracts() {
    return useQuery<RopaContractDto[], Error>({
        queryKey: ['ropa-lookups', 'contracts'],
        queryFn: getAllRopaContracts,
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60,
    });
}

// ============================================
// 🔍 HOOKS FILTROS
// ============================================

export function useRopaTableFiltered(filters: RopaTableFilters) {
    return useQuery({
        queryKey: ['ropa-table', 'filtered', filters],
        queryFn: () => getRopaTableFiltered(filters),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

export function useProcessOwnerFilter() {
    return useQuery({
        queryKey: ['ropa-table', 'filter-options', 'processOwner'],
        queryFn: getProcessOwnerFilterOptions,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

export function useDataCategoriesFilter() {
    return useQuery({
        queryKey: ['ropa-table', 'filter-options', 'dataCategories'],
        queryFn: getDataCategoriesFilterOptions,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

export function useDataSharedFilter() {
    return useQuery({
        queryKey: ['ropa-table', 'filter-options', 'dataShared'],
        queryFn: getDataSharedFilterOptions,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}