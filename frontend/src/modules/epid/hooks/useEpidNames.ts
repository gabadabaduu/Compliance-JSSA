import { useQuery } from '@tanstack/react-query';
import { getEpidNames } from '../services/epidService';

export function useEpidNames() {
    return useQuery({
        queryKey: ['epid', 'names'],
        queryFn: getEpidNames,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}