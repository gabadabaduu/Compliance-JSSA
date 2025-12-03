import { useEffect, useCallback } from 'react'
import { createSignalRConnection, startConnection, stopConnection, getConnection } from '../lib/signalr'
import { useUserStore } from '../stores/userStore'
import { useAuthStore } from '../stores/authStore'

export function useSignalR() {
    const { user } = useAuthStore()
    const { loadUserData } = useUserStore()

    const handlePermissionsChanged = useCallback(async (data: any) => {
        console.log('📢 Permisos actualizados:', data)

        // Recargar datos del usuario
        await loadUserData(true) // forceReload = true

        // Opcional: mostrar notificación al usuario
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Permisos actualizados', {
                body: 'Tus permisos han sido modificados por un administrador.',
                icon: '/favicon.ico'
            })
        }
    }, [loadUserData])

    useEffect(() => {
        if (!user) {
            stopConnection()
            return
        }

        const initConnection = async () => {
            const conn = await createSignalRConnection()

            if (conn) {
                // Registrar handler para el evento
                conn.off('PermissionsChanged') // Limpiar handler anterior si existe
                conn.on('PermissionsChanged', handlePermissionsChanged)

                // Iniciar conexión
                await startConnection()
            }
        }

        initConnection()

        // Cleanup al desmontar o cuando cambia el usuario
        return () => {
            const conn = getConnection()
            if (conn) {
                conn.off('PermissionsChanged')
            }
        }
    }, [user, handlePermissionsChanged])
}