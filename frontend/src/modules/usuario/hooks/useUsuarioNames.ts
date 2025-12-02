import { useQuery } from '@tanstack/react-query';
import { getUsuarioNames } from '../services/usuarioService';

export function useUsuarioNames() {
    return useQuery({
        queryKey: ['usuario', 'names'],
        queryFn: getUsuarioNames,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}