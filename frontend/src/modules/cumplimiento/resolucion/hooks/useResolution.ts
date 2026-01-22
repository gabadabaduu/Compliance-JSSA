import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAllResolutions,
    getResolutionById,
    createResolution,
    updateResolution,
    deleteResolution,
    getResolutionsFiltered,
    getSanctionsForFilter,
    getYearsForFilter,
    getResolutionTypesForFilter,
    getInfringementsForFilter,
    getSanctionTypesForFilter,
    getOutcomesForFilter,
    type ResolutionFilters
} from '../services/resolutionService';
import type { CreateResolutionDto, UpdateResolutionDto } from '../types';

// ============================================
// 📋 HOOKS CRUD
// ============================================

export function useResolutions() {
    return useQuery({
        queryKey: ['resolutions'],
        queryFn: () => getAllResolutions(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

export function useResolution(id: number) {
    return useQuery({
        queryKey: ['resolution', id],
        queryFn: () => getResolutionById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

export function useCreateResolution() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateResolutionDto) => createResolution(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resolutions'] });
        },
    });
}

export function useUpdateResolution() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateResolutionDto) => updateResolution(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['resolutions'] });
            queryClient.invalidateQueries({ queryKey: ['resolution', variables.id] });
        },
    });
}

export function useDeleteResolution() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteResolution(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resolutions'] });
        },
    });
}

// ============================================
// 🔍 HOOKS PARA FILTROS
// ============================================

export function useResolutionsFiltered(filters: ResolutionFilters) {
    return useQuery({
        queryKey: ['resolutions', 'filtered', filters],
        queryFn: () => getResolutionsFiltered(filters),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

export function useSanctionsForFilter() {
    return useQuery({
        queryKey: ['sanctions', 'filter-options'],
        queryFn: getSanctionsForFilter,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

export function useYearsForFilter() {
    return useQuery({
        queryKey: ['resolutions', 'years', 'filter-options'],
        queryFn: getYearsForFilter,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

export function useResolutionTypesForFilter() {
    return useQuery({
        queryKey: ['resolutions', 'types', 'filter-options'],
        queryFn: getResolutionTypesForFilter,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

export function useInfringementsForFilter() {
    return useQuery({
        queryKey: ['infringements', 'filter-options'],
        queryFn: getInfringementsForFilter,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

export function useSanctionTypesForFilter() {
    return useQuery({
        queryKey: ['sanction-types', 'filter-options'],
        queryFn: getSanctionTypesForFilter,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

export function useOutcomesForFilter() {
    return useQuery({
        queryKey: ['outcomes', 'filter-options'],
        queryFn: getOutcomesForFilter,
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60,
    });
}