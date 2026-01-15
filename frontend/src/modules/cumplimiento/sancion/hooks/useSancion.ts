import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAllSanctions,
    getSanctionById,
    createSanction,
    updateSanction,
    deleteSanction,
    getSanctionsByStatus,
    getSanctionsByStage,
    getSanctionsByEntity
} from '../services/sancionService';
import type { CreateSanctionDto, UpdateSanctionDto, Sanction } from '../types';

// ✅ Hook para obtener todas las sanctions (AHORA USA LA API REAL)
export function useSanctions() {
    return useQuery({
        queryKey: ['sanctions'],
        queryFn: getAllSanctions, // ✅ Llamada real al backend
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

// Hook para obtener sanction por ID
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

// Hook para obtener sanctions por status
export function useSanctionsByStatus(status: string) {
    return useQuery({
        queryKey: ['sanctions', 'status', status],
        queryFn: () => getSanctionsByStatus(status),
        enabled: !!status,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    });
}

// Hook para obtener sanctions por stage
export function useSanctionsByStage(stage: string) {
    return useQuery({
        queryKey: ['sanctions', 'stage', stage],
        queryFn: () => getSanctionsByStage(stage),
        enabled: !!stage,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    });
}

// Hook para obtener sanctions por entity
export function useSanctionsByEntity(entityId: number) {
    return useQuery({
        queryKey: ['sanctions', 'entity', entityId],
        queryFn: () => getSanctionsByEntity(entityId),
        enabled: !!entityId,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    });
}

// Hook para crear sanction
export function useCreateSanction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateSanctionDto) => createSanction(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sanctions'] });
        },
    });
}

// Hook para actualizar sanction
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

// Hook para eliminar sanction
export function useDeleteSanction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteSanction(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sanctions'] });
        },
    });
}