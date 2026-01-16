import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { catalogService } from '../services/catalogService';
import type { CatalogItem } from '../types';

export function useCatalog(endpoint: string) {
    const queryClient = useQueryClient();
    const queryKey = ['catalog', endpoint];

    // Obtener datos
    const { data, isPending, isError, error } = useQuery({
        queryKey,
        queryFn: () => catalogService.getAll(endpoint),
    });

    // Mutación para crear
    const createMutation = useMutation({
        mutationFn: (data: Omit<CatalogItem, 'id'>) => catalogService.create(endpoint, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    // Mutación para actualizar
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<CatalogItem> }) =>
            catalogService.update(endpoint, id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    // Mutación para eliminar
    const deleteMutation = useMutation({
        mutationFn: (id: number) => catalogService.delete(endpoint, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    return {
        data: data || [],
        isPending,
        isError,
        error,
        create: createMutation.mutate,
        update: updateMutation.mutate,
        remove: deleteMutation.mutate,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
}