import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getMyNotifications, getMyNotificationCount, refreshNotifications } from '../services/notificationService';

export function useMyNotifications(email: string) {
    return useQuery({
        queryKey: ['my-notifications', email],
        queryFn: () => getMyNotifications(email),
        enabled: !!email,
        staleTime: 1000 * 30,
        refetchInterval: 1000 * 60 * 5,
        refetchOnMount: 'always',
        refetchOnWindowFocus: true,
    });
}

export function useMyNotificationCount(email: string) {
    return useQuery({
        queryKey: ['my-notification-count', email],
        queryFn: () => getMyNotificationCount(email),
        enabled: !!email,
        staleTime: 1000 * 30,
        refetchInterval: 1000 * 60 * 3,
        refetchOnMount: 'always',
        refetchOnWindowFocus: true,
    });
}

export function useRefreshNotifications(email: string) {
    const queryClient = useQueryClient();

    const refresh = useCallback(async () => {
        if (!email) return;
        try {
            await refreshNotifications(email);
            queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
            queryClient.invalidateQueries({ queryKey: ['my-notification-count'] });
        } catch (error) {
            console.error('Error refrescando notificaciones:', error);
        }
    }, [email, queryClient]);

    return refresh;
}