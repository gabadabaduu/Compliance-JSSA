import { useQuery } from '@tanstack/react-query';
import { getMyNotifications, getMyNotificationCount } from '../services/notificationService';

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