import { useQuery } from '@tanstack/react-query';
import { getHabeasDataNames } from '../services/habeasDataService';

export function useHabeasDataNames() {
    return useQuery({
        queryKey: ['habeasdata', 'names'],
        queryFn: getHabeasDataNames,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}