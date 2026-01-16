import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAllResolutions,
    getResolutionById,
    createResolution,
    updateResolution,
    deleteResolution,
    getResolutionsByOutcome,
    getResolutionsByYear
} from '../services/resolutionService';
import type { CreateResolutionDto, UpdateResolutionDto } from '../types';

// Hook para obtener todas las resolutions
export function useResolutions() {
    return useQuery({
        queryKey: ['resolutions'],
        queryFn: () => getAllResolutions(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

// Hook para obtener resolution por ID
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

// Hook para obtener resolutions por outcome
export function useResolutionsByOutcome(outcome: string) {
    return useQuery({
        queryKey: ['resolutions', 'outcome', outcome],
        queryFn: () => getResolutionsByOutcome(outcome),
        enabled: !!outcome,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    });
}

// Hook para obtener resolutions por año
export function useResolutionsByYear(year: number) {
    return useQuery({
        queryKey: ['resolutions', 'year', year],
        queryFn: () => getResolutionsByYear(year),
        enabled: !!year,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    });
}

// Hook para crear resolution
export function useCreateResolution() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateResolutionDto) => createResolution(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resolutions'] });
        },
    });
}

// Hook para actualizar resolution
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

// Hook para eliminar resolution
export function useDeleteResolution() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteResolution(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resolutions'] });
        },
    });
}