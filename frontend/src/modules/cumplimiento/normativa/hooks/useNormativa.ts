import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAllRegulations,
    getRegulationById,
    createRegulation,
    updateRegulation,
    deleteRegulation,
    getRegulationsByStatus,
    getRegulationsByYear
} from '../services/normativaService';
import { RegulationStatus } from '../types';
import type { CreateRegulationDto, UpdateRegulationDto, Regulation } from '../types';

// Hook para obtener todas las regulations
export function useRegulations() {
    return useQuery({
        queryKey: ['regulations'],
        queryFn: () => getAllRegulations(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}
// Hook para obtener regulation por ID
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

// Hook para obtener regulations por status
export function useRegulationsByStatus(status: string) {
    return useQuery({
        queryKey: ['regulations', 'status', status],
        queryFn: () => getRegulationsByStatus(status),
        enabled: !!status,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    });
}

// Hook para obtener regulations por año
export function useRegulationsByYear(year: number) {
    return useQuery({
        queryKey: ['regulations', 'year', year],
        queryFn: () => getRegulationsByYear(year),
        enabled: !!year,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    });
}

// Hook para crear regulation
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

// Hook para actualizar regulation
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

// Hook para eliminar regulation
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