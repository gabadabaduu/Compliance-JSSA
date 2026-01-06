import { useUserStore } from '../stores/userStore'
import { UserPermissions } from '../types/user.types'
import './ModuleRoute.css'

interface ModuleRouteProps {
    children: React.ReactNode
    requiredAccess: keyof UserPermissions
}

export default function ModuleRoute({ children, requiredAccess }: ModuleRouteProps) {
    const { hasAccess, userData } = useUserStore()

    // Verificar acceso usando los permisos ya cargados
    if (!hasAccess(requiredAccess)) {
        return (
            <div className="access-denied">
                <div className="access-denied-card">
                    <div className="access-denied-icon">🚫</div>
                    <h2>Acceso Denegado</h2>
                    <p>No tienes permisos para acceder a este módulo.</p>
                    <p className="role-info">
                        Tu rol actual: <strong>{userData?.role || 'desconocido'}</strong>
                    </p>
                    <a href="/app/dashboard" className="btn-back">
                        Volver al Dashboard
                    </a>
                </div>
            </div>
        )
    }

    return <>{children}</>
}