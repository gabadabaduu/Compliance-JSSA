import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useUserStore } from '../stores/userStore'
import { useSignalR } from '../hooks/useSignalR'
import { useFocusRefresh } from '../hooks/useFocusRefresh'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading: authLoading, checkAuth } = useAuthStore()
    const { userData, permissionsLoading, permissionsLoaded, loadUserData, clearUserData } = useUserStore()

    // ✅ Conectar SignalR para recibir notificaciones en tiempo real
    useSignalR()

    // ✅ Refrescar permisos cuando el usuario vuelve a la pestaña
    useFocusRefresh()

    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    useEffect(() => {
        if (!user) return

        if (!permissionsLoaded && !permissionsLoading) {
            loadUserData()
        }
    }, [user, permissionsLoaded, permissionsLoading, loadUserData])


    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (permissionsLoading || !permissionsLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando permisos...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}