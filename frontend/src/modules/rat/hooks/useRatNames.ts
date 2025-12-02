import { useQuery } from '@tanstack/react-query';
import { getRatNames } from '../services/ratService';

export function useRatNames() {
    return useQuery({
        queryKey: ['rat', 'names'],
        queryFn: getRatNames,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}