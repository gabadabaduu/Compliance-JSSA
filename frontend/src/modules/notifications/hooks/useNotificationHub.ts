import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '../../../stores/userStore';
import { createSignalRConnection, startConnection, getConnection } from '../../../lib/signalr';

export function useNotificationHub() {
    const queryClient = useQueryClient();
    const { userData } = useUserStore();

    useEffect(() => {
        if (!userData?.email) return;

        let mounted = true;

        const invalidateNotifications = () => {
            if (!mounted) return;
            console.log('📡 WebSocket: Refrescando notificaciones...');
            queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
            queryClient.invalidateQueries({ queryKey: ['my-notification-count'] });
        };

        const setupConnection = async () => {
            let conn = getConnection();

            if (!conn) {
                conn = await createSignalRConnection();
            }

            if (!conn) return;

            // Limpiar listeners anteriores
            conn.off('DsrNotificationsUpdated');
            conn.off('DsrNotificationsCleared');
            conn.off('dsrNotificationsUpdated');
            conn.off('dsrNotificationsCleared');

            // Registrar AMBAS variantes (PascalCase y camelCase)
            // SignalR JS client convierte a camelCase automáticamente
            conn.on('DsrNotificationsUpdated', invalidateNotifications);
            conn.on('dsrNotificationsUpdated', invalidateNotifications);
            conn.on('DsrNotificationsCleared', invalidateNotifications);
            conn.on('dsrNotificationsCleared', invalidateNotifications);

            if (conn.state === 'Disconnected') {
                await startConnection();
            }
        };

        setupConnection();

        return () => {
            mounted = false;
            const conn = getConnection();
            if (conn) {
                conn.off('DsrNotificationsUpdated');
                conn.off('DsrNotificationsCleared');
                conn.off('dsrNotificationsUpdated');
                conn.off('dsrNotificationsCleared');
            }
        };
    }, [userData?.email, queryClient]);
}