import { useQuery } from '@tanstack/react-query';
import { getNormogramaNames } from '../services/normogramaService';

export function useNormogramaNames() {
    return useQuery({
        queryKey: ['normograma', 'names'],
        queryFn: getNormogramaNames,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}