import { useQuery } from '@tanstack/react-query';
import { getNormativaNames } from '../services/normativaService';

export function useNormativaNames() {
    return useQuery({
        queryKey: ['normativa', 'names'],
        queryFn: getNormativaNames,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}