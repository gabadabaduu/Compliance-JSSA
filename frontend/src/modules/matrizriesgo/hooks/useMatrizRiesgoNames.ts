import { useQuery } from '@tanstack/react-query';
import { getMatrizRiesgoNames } from '../services/MatrizRiesgoService';

export function useMatrizRiesgoNames() {
    return useQuery({
        queryKey: ['matrizriesgo', 'names'],
        queryFn: getMatrizRiesgoNames,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}