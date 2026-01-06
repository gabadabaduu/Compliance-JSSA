import { useQuery } from '@tanstack/react-query';
import { getAjustesNames } from '../services/ajustesService';

export function useAjustesNames() {
    return useQuery({
        queryKey: ['ajustes', 'names'],
        queryFn: getAjustesNames,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}