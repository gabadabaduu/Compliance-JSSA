import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAllDsrs,
    getDsrById,
    createDsr,
    updateDsr,
    deleteDsr,
    getDsrsFiltered,
    getTypesForFilter,
    getStagesForFilter,
    getStatusesForFilter,
    getAllRequestTypes,
    getAllStatuses,
    type DsrFilters
} from '../services/habeasDataService';
import type { CreateDsrDto, UpdateDsrDto } from '../types';

// ============================================
// 📋 HOOKS CRUD - DSR
// ============================================

export function useDsrs() {
    return useQuery({
        queryKey: ['dsrs'],
        queryFn: getAllDsrs,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

export function useDsr(id: number) {
    return useQuery({
        queryKey: ['dsr', id],
        queryFn: () => getDsrById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

export function useCreateDsr() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateDsrDto) => createDsr(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dsrs'] });
        },
    });
}

export function useUpdateDsr() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateDsrDto) => updateDsr(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['dsrs'] });
            queryClient.invalidateQueries({ queryKey: ['dsr', variables.id] });
        },
    });
}

export function useDeleteDsr() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteDsr(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dsrs'] });
        },
    });
}

// ============================================
// 📋 HOOKS - REQUEST TYPES & STATUSES
// ============================================

export function useRequestTypes() {
    return useQuery({
        queryKey: ['dsr-request-types'],
        queryFn: getAllRequestTypes,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

export function useStatuses() {
    return useQuery({
        queryKey: ['dsr-statuses'],
        queryFn: getAllStatuses,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

// ============================================
// 🔍 HOOKS PARA FILTROS
// ============================================

export function useDsrsFiltered(filters: DsrFilters) {
    return useQuery({
        queryKey: ['dsrs', 'filtered', filters],
        queryFn: () => getDsrsFiltered(filters),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

export function useTypesForFilter() {
    return useQuery({
        queryKey: ['dsr-types', 'filter-options'],
        queryFn: getTypesForFilter,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

export function useStagesForFilter() {
    return useQuery({
        queryKey: ['dsr-stages', 'filter-options'],
        queryFn: getStagesForFilter,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

export function useStatusesForFilter() {
    return useQuery({
        queryKey: ['dsr-statuses', 'filter-options'],
        queryFn: getStatusesForFilter,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}