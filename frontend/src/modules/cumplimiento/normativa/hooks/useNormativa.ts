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
        queryFn: async (): Promise<Regulation[]> => {
            // 🔴 DATOS QUEMADOS PARA DESARROLLO
            return [
                {
                    id: 1,
                    type: 1,
                    number: 1581,
                    issueDate: new Date('2012-10-17'),
                    year: 2012,
                    regulation: 'Decreto 1581 de 2012',
                    commonName: 'Régimen de Protección de Datos Personales',
                    industry: 1,
                    authority: 1,
                    title: 'Por el cual se dictan disposiciones generales para la protección de datos personales',
                    domain: 1,
                    status: RegulationStatus.Vigente,
                    url: 'https://ejemplo.com/decreto-1581.pdf',
                },
                {
                    id: 2,
                    type: 1,
                    number: 1377,
                    issueDate: new Date('2013-06-27'),
                    year: 2013,
                    regulation: 'Decreto 1377 de 2013',
                    commonName: 'Reglamento Protección de Datos',
                    industry: 1,
                    authority: 1,
                    title: 'Por el cual se reglamenta parcialmente la Ley 1581 de 2012',
                    domain: 1,
                    status: RegulationStatus.Vigente,
                    url: 'https://ejemplo.com/decreto-1377.pdf',
                },
                {
                    id: 3,
                    type: 2,
                    number: 679,
                    issueDate: new Date('2016-04-27'),
                    year: 2016,
                    regulation: 'GDPR 679/2016',
                    commonName: 'Reglamento General de Protección de Datos',
                    industry: 2,
                    authority: 2,
                    title: 'Reglamento General de Protección de Datos de la Unión Europea',
                    domain: 2,
                    status: RegulationStatus.Compilada,
                    url: 'https://ejemplo.com/gdpr. pdf',
                },
            ];
        },
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