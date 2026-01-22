import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAllRegulations,
    getRegulationById,
    createRegulation,
    updateRegulation,
    deleteRegulation,
    getRegulationsFiltered,
    getTypesForFilter,
    getYearsForFilter,
    getAuthoritiesForFilter,
    getIndustriesForFilter,
    getDomainsForFilter,
    getStatusesForFilter,
    type RegulationFilters
} from '../services/normativaService';
import type { CreateRegulationDto, UpdateRegulationDto } from '../types';

// ============================================
// 📋 HOOKS CRUD
// ============================================

export function useRegulations() {
    return useQuery({
        queryKey: ['regulations'],
        queryFn: () => getAllRegulations(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

export function useRegulation(id: number) {
    return useQuery({
        queryKey: ['regulation', id],
        queryFn: () => getRegulationById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

export function useCreateRegulation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateRegulationDto) => createRegulation(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['regulations'] });
            queryClient.invalidateQueries({ queryKey: ['regulation', 'names'] });
        },
    });
}

export function useUpdateRegulation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateRegulationDto) => updateRegulation(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['regulations'] });
            queryClient.invalidateQueries({ queryKey: ['regulation', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['regulation', 'names'] });
        },
    });
}

export function useDeleteRegulation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteRegulation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['regulations'] });
            queryClient.invalidateQueries({ queryKey: ['regulation', 'names'] });
        },
    });
}

// ============================================
// 🔍 HOOKS PARA FILTROS
// ============================================

export function useRegulationsFiltered(filters: RegulationFilters) {
    return useQuery({
        queryKey: ['regulations', 'filtered', filters],
        queryFn: () => getRegulationsFiltered(filters),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

export function useTypesForFilter() {
    return useQuery({
        queryKey: ['types', 'filter-options'],
        queryFn: getTypesForFilter,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

export function useYearsForFilter() {
    return useQuery({
        queryKey: ['regulations', 'years', 'filter-options'],
        queryFn: getYearsForFilter,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

export function useAuthoritiesForFilter() {
    return useQuery({
        queryKey: ['authorities', 'filter-options'],
        queryFn: getAuthoritiesForFilter,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

export function useIndustriesForFilter() {
    return useQuery({
        queryKey: ['industries', 'filter-options'],
        queryFn: getIndustriesForFilter,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

export function useDomainsForFilter() {
    return useQuery({
        queryKey: ['domains', 'filter-options'],
        queryFn: getDomainsForFilter,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

export function useStatusesForFilter() {
    return useQuery({
        queryKey: ['statuses', 'filter-options'],
        queryFn: getStatusesForFilter,
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60,
    });
}