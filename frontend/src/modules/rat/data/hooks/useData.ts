import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAllDataStorages,
    getDataStorageById,
    createDataStorage,
    updateDataStorage,
    deleteDataStorage,
    getDataStoragesFiltered,
    getProcessingModesForFilter,
    getCountriesForFilter,
    getAllDepartments,
    type DataStorageFilters
} from '../services/dataService';
import type { CreateRopaDataStorageDto, UpdateRopaDataStorageDto } from '../types';
import { useUserStore } from '../../../../stores/userStore';
import { usePermissions } from '../../../../hooks/usePermissions';

// ============================================
// 📋 HOOKS CRUD - ROPA DATA STORAGE
// ============================================

export function useDataStorages() {
    const { isSuperAdmin } = usePermissions();
    const { userData } = useUserStore();
    const companyName = isSuperAdmin ? undefined : userData?.nombreEmpresa;

    return useQuery({
        queryKey: ['ropa-data-storages', companyName],
        queryFn: () => getAllDataStorages(companyName),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

export function useDataStorage(id: number) {
    return useQuery({
        queryKey: ['ropa-data-storage', id],
        queryFn: () => getDataStorageById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

export function useCreateDataStorage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateRopaDataStorageDto) => createDataStorage(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ropa-data-storages'] });
        },
    });
}

export function useUpdateDataStorage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateRopaDataStorageDto) => updateDataStorage(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['ropa-data-storages'] });
            queryClient.invalidateQueries({ queryKey: ['ropa-data-storage', variables.id] });
        },
    });
}

export function useDeleteDataStorage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteDataStorage(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ropa-data-storages'] });
        },
    });
}

// ============================================
// 📋 HOOKS - DEPARTAMENTOS (para dropdown custodian)
// ============================================

export function useDepartments() {
    return useQuery({
        queryKey: ['ropa-departments'],
        queryFn: getAllDepartments,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

// ============================================
// 🔍 HOOKS PARA FILTROS
// ============================================

export function useDataStoragesFiltered(filters: DataStorageFilters) {
    return useQuery({
        queryKey: ['ropa-data-storages', 'filtered', filters],
        queryFn: () => getDataStoragesFiltered(filters),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

export function useProcessingModesForFilter() {
    return useQuery({
        queryKey: ['ropa-processing-modes', 'filter-options'],
        queryFn: getProcessingModesForFilter,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

export function useCountriesForFilter() {
    return useQuery({
        queryKey: ['ropa-countries', 'filter-options'],
        queryFn: getCountriesForFilter,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}