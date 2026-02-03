import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAllSanctions,
    getSanctionById,
    createSanction,
    updateSanction,
    deleteSanction,
    getSanctionsFiltered,
    getEntitiesForFilter,
    getResolutionsForFilter,
    type SanctionFilters
} from '../services/sancionService';
import type { CreateSanctionDto, UpdateSanctionDto } from '../types';

// ============================================
// 📋 HOOKS CRUD
// ============================================

export function useSanctions() {
    return useQuery({
        queryKey: ['sanctions'],
        queryFn: getAllSanctions,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

export function useSanction(id: number) {
    return useQuery({
        queryKey: ['sanction', id],
        queryFn: () => getSanctionById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

export function useCreateSanction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateSanctionDto) => createSanction(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sanctions'] });
        },
    });
}

export function useUpdateSanction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateSanctionDto) => updateSanction(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['sanctions'] });
            queryClient.invalidateQueries({ queryKey: ['sanction', variables.id] });
        },
    });
}

export function useDeleteSanction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteSanction(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sanctions'] });
        },
    });
}

// ============================================
// 🔍 HOOKS PARA FILTROS
// ============================================

export function useSanctionsFiltered(filters: SanctionFilters) {
    return useQuery({
        queryKey: ['sanctions', 'filtered', filters],
        queryFn: () => getSanctionsFiltered(filters),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

export function useStatusForFilter() {
    return useQuery({
        queryKey: ['status', 'filter-options'],
        queryFn: getEntitiesForFilter,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

export function useEntitiesForFilter() {
    return useQuery({
        queryKey: ['entities', 'filter-options'],
        queryFn: getEntitiesForFilter,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

export function useResolutionsForFilter() {
    return useQuery({
        queryKey: ['resolutions', 'filter-options'],
        queryFn: getResolutionsForFilter,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}