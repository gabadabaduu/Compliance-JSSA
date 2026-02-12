import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAllContracts,
    getContractById,
    createContract,
    updateContract,
    deleteContract,
    getContractsFiltered,
    getContractTypesForFilter,
    getContractStatusesForFilter,
    getAllEntities,
    type ContractFilters
} from '../services/contractsService';
import type { CreateRopaContractDto, UpdateRopaContractDto } from '../types';
import { useUserStore } from '../../../../stores/userStore';
import { usePermissions } from '../../../../hooks/usePermissions';

// ============================================
// 📋 HOOKS CRUD - ROPA CONTRACTS
// ============================================

export function useContracts() {
    const { isSuperAdmin } = usePermissions();
    const { userData } = useUserStore();
    const companyName = isSuperAdmin ? undefined : userData?.nombreEmpresa;

    return useQuery({
        queryKey: ['ropa-contracts', companyName],
        queryFn: () => getAllContracts(companyName),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

export function useContract(id: number) {
    return useQuery({
        queryKey: ['ropa-contract', id],
        queryFn: () => getContractById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

export function useCreateContract() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateRopaContractDto) => createContract(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ropa-contracts'] });
        },
    });
}

export function useUpdateContract() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateRopaContractDto) => updateContract(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['ropa-contracts'] });
            queryClient.invalidateQueries({ queryKey: ['ropa-contract', variables.id] });
        },
    });
}

export function useDeleteContract() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteContract(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ropa-contracts'] });
        },
    });
}

// ============================================
// 📋 HOOKS - ENTIDADES (para dropdown)
// ============================================

export function useEntities() {
    return useQuery({
        queryKey: ['ropa-entities'],
        queryFn: getAllEntities,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

// ============================================
// 🔍 HOOKS PARA FILTROS
// ============================================

export function useContractsFiltered(filters: ContractFilters) {
    return useQuery({
        queryKey: ['ropa-contracts', 'filtered', filters],
        queryFn: () => getContractsFiltered(filters),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

export function useContractTypesForFilter() {
    return useQuery({
        queryKey: ['ropa-contract-types', 'filter-options'],
        queryFn: getContractTypesForFilter,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}

export function useContractStatusesForFilter() {
    return useQuery({
        queryKey: ['ropa-contract-statuses', 'filter-options'],
        queryFn: getContractStatusesForFilter,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    });
}