import { useEffect, useRef } from 'react'
import { useUserStore } from '../stores/userStore'
import { useAuthStore } from '../stores/authStore'

const REFRESH_INTERVAL_MS = 5 * 60 * 1000 // 5 minutos

export function useFocusRefresh() {
    const { user } = useAuthStore()
    const { loadUserData, lastLoadedAt } = useUserStore()
    const lastFocusCheck = useRef<number>(Date.now())

    useEffect(() => {
        if (!user) return

        const handleFocus = async () => {
            const now = Date.now()
            const lastLoaded = lastLoadedAt || 0
            const timeSinceLastLoad = now - lastLoaded

            // Solo recargar si pasaron más de 5 minutos desde la última carga
            if (timeSinceLastLoad > REFRESH_INTERVAL_MS) {
                console.log('🔄 Recargando permisos después de focus.. .')
                await loadUserData(true) // forceReload = true
            }

            lastFocusCheck.current = now
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                handleFocus()
            }
        }

        window.addEventListener('focus', handleFocus)
        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            window.removeEventListener('focus', handleFocus)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [user, loadUserData, lastLoadedAt])
}