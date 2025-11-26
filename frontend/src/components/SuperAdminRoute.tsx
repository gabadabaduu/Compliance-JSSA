import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useUserRole } from '../modules/auth/hooks/useUserRole'

interface SuperAdminRouteProps {
    children: React.ReactNode
}

export default function SuperAdminRoute({ children }: SuperAdminRouteProps) {
    const { user, loading: authLoading, checkAuth } = useAuthStore()
    const { role, loading: roleLoading } = useUserRole()

    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    // Mostrar loading mientras verifica autenticación y rol
    if (authLoading || roleLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-600">Verificando permisos...</p>
                </div>
            </div>
        )
    }

    // Si no está logueado, redirigir a login
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Si no es superadmin, mostrar página de acceso denegado
    if (role !== 'superadmin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="text-red-600 mb-4">
                        <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3. 34 16c-.77 1. 333.192 3 1. 732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
                    <p className="text-gray-600 mb-6">
                        No tienes permisos de SuperAdmin para acceder a esta página.
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        Tu rol actual: <span className="font-semibold">{role || 'desconocido'}</span>
                    </p>
                    <a
                        href="/dashboard"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                    >
                        Volver al Dashboard
                    </a>
                </div>
            </div>
        )
    }

    // Si es superadmin, mostrar el contenido
    return <>{children}</>
}