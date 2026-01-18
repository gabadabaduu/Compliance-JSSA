import { usePermissions } from '../../../hooks/usePermissions'
import ChangePasswordSection from '../components/ChangePasswordSection'
import AdminUsuario from '../components/AdminUsuario'
import UserProfileCard from '../components/UserProfileCard/UserProfileCard'
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner'

export default function UsuarioPage() {
    const { role, loading } = usePermissions()

    if (loading) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <LoadingSpinner size="large" text="Cargando..." />
            </div>
        )
    }

    return (
        <div className="min-h-full p-6">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-10 text-center">
                Mi Cuenta
            </h1>

            <div className="space-y-6">
                {/* Card superior: Perfil + Crear Usuario */}
                <UserProfileCard showCreateUser={role === 'admin' || role === 'superadmin'} />

                {/* Tabla de usuarios (solo admin/superadmin) */}
                {(role === 'admin' || role === 'superadmin') && <AdminUsuario />}

                {/* Cambio de contraseña (solo usuarios normales) */}
                {role === 'user' && (
                    <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-6">
                        <ChangePasswordSection />
                    </div>
                )}
            </div>
        </div>
    )
}