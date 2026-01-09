import { useQuery } from '@tanstack/react-query';
import { getSancionNames } from '../services/sancionService';

export function useSancionNames() {
    return useQuery({
        queryKey: ['normograma', 'names'],
        queryFn: getSancionNames,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}