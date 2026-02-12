import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAllEntities,
    getEntityById,
    createEntity,
    updateEntity,
    deleteEntity,
    getEntitiesFiltered,
    getCountriesForFilter,
    getAllContactChannels,
    type EntityFilters
} from '../services/entitiesService';
import type { CreateRopaEntityDto, UpdateRopaEntityDto } from '../types';
import { useUserStore } from '../../../../stores/userStore';
import { usePermissions } from '../../../../hooks/usePermissions';

// ============================================
// 📋 HOOKS CRUD - ROPA ENTITIES
// ============================================

export function useEntities() {
    const { isSuperAdmin } = usePermissions();
    const { userData } = useUserStore();
    const companyName = isSuperAdmin ? undefined : userData?.nombreEmpresa;

    return useQuery({
        queryKey: ['ropa-entities', companyName],
        queryFn: () => getAllEntities(companyName),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

export function useEntity(id: number) {
    return useQuery({
        queryKey: ['ropa-entity', id],
        queryFn: () => getEntityById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

export function useCreateEntity() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateRopaEntityDto) => createEntity(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ropa-entities'] });
        },
    });
}

export function useUpdateEntity() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateRopaEntityDto) => updateEntity(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['ropa-entities'] });
            queryClient.invalidateQueries({ queryKey: ['ropa-entity', variables.id] });
        },
    });
}

export function useDeleteEntity() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteEntity(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ropa-entities'] });
        },
    });
}

// ============================================
// 📋 HOOKS - CONTACT CHANNELS (para dropdown)
// ============================================

export function useContactChannels() {
    return useQuery({
        queryKey: ['ropa-contact-channels'],
        queryFn: getAllContactChannels,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

// ============================================
// 🔍 HOOKS PARA FILTROS
// ============================================

export function useEntitiesFiltered(filters: EntityFilters) {
    return useQuery({
        queryKey: ['ropa-entities', 'filtered', filters],
        queryFn: () => getEntitiesFiltered(filters),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

export function useCountriesForFilter() {
    return useQuery({
        queryKey: ['ropa-entity-countries', 'filter-options'],
        queryFn: getCountriesForFilter,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}