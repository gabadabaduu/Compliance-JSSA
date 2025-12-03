import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useUserStore } from '../stores/userStore'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading: authLoading, checkAuth } = useAuthStore()
    const { userData, permissionsLoading, permissionsLoaded, loadUserData, clearUserData } = useUserStore()

    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    // Cargar permisos cuando hay usuario autenticado
    // Y verificar que el userData corresponda al usuario actual
    useEffect(() => {
        if (user) {
            // Si el userData es de otro usuario, limpiar y recargar
            if (userData && userData.id !== user.id) {
                clearUserData()
                return // El siguiente render cargará los datos nuevos
            }

            // Si no hay datos cargados, cargar
            if (!permissionsLoaded && !permissionsLoading) {
                loadUserData()
            }
        }
    }, [user, userData, permissionsLoaded, permissionsLoading, loadUserData, clearUserData])

    // Loading de autenticación
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    // No autenticado
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Loading de permisos
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