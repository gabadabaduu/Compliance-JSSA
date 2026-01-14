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
import { SanctionStage, SanctionStatus } from '../types';
import type { CreateSanctionDto, UpdateSanctionDto, Sanction } from '../types';

// Hook para obtener todas las sanctions
export function useSanctions() {
    return useQuery({
        queryKey: ['sanctions'],
        queryFn: async (): Promise<Sanction[]> => {
            // 🔴 DATOS QUEMADOS PARA DESARROLLO
            return [
                {
                    id: 1,
                    number: 2023001,
                    entity: 1,
                    facts: 'Uso indebido de datos personales sin autorización del titular.  Se evidenció el tratamiento de información sensible sin cumplir con los requisitos legales establecidos.',
                    stage: SanctionStage.DecisionInicial,
                    status: SanctionStatus.EnTramite,
                    initial: 'Se inició proceso administrativo sancionatorio el 15 de enero de 2023',
                    reconsideration: '',
                    appeal: '',
                },
                {
                    id: 2,
                    number: 2023002,
                    entity: 2,
                    facts: 'Falta de implementación de medidas de seguridad adecuadas. Se presentó una vulneración de datos que afectó a 5000 usuarios.',
                    stage: SanctionStage.RecursoReposicion,
                    status: SanctionStatus.EnTramite,
                    initial: 'Resolución inicial emitida el 10 de marzo de 2023 con multa de $50,000,000',
                    reconsideration: 'Recurso de reposición presentado el 25 de marzo de 2023',
                    appeal: '',
                },
                {
                    id: 3,
                    number: 2022015,
                    entity: 3,
                    facts: 'No atención oportuna a solicitudes de derechos ARCO. Múltiples solicitudes sin respuesta en los términos legales.',
                    stage: SanctionStage.RecursoApelacion,
                    status: SanctionStatus.EnFirme,
                    initial: 'Resolución inicial del 5 de junio de 2022',
                    reconsideration: 'Recurso de reposición negado el 20 de julio de 2022',
                    appeal: 'Recurso de apelación negado el 15 de septiembre de 2022',
                },
            ];
        },
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
            queryClient.invalidateQueries({ queryKey: ['sanction', 'names'] });
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
            queryClient.invalidateQueries({ queryKey: ['sanction', 'names'] });
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
            queryClient.invalidateQueries({ queryKey: ['sanction', 'names'] });
        },
    });
}