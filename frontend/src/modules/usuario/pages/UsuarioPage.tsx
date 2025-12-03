import { usePermissions } from '../../../hooks/usePermissions'
import ChangePasswordSection from '../components/ChangePasswordSection'
import AdminUsuario from '../components/AdminUsuario'
import LogoutSection from '../components/LogoutSection'
import Cruduser from '../components/CrudUsuario/CrudUsuario'
import './UsuarioPage.css'

export default function UsuarioPage() {
    const { role, loading, userData } = usePermissions()

    // DEBUG - Quitar después
    console.log('🔍 UsuarioPage - role:', role)
    console.log('🔍 UsuarioPage - loading:', loading)
    console.log('🔍 UsuarioPage - userData:', userData)

    if (loading) {
        return (
            <div className="usuario-page">
                <p className="usuario-loading">Cargando...</p>
            </div>
        )
    }

    // DEBUG - Ver qué condiciones se evalúan
    console.log('🔍 role === user:', role === 'user')
    console.log('🔍 role === admin || superadmin:', role === 'admin' || role === 'superadmin')

    return (
        <div className="usuario-page">
            <h1 className="usuario-title">Mi Cuenta</h1>

            {/* Solo para usuarios normales */}
            {role === 'user' && <ChangePasswordSection />}

            {/* Solo para admin/superadmin */}
            {(role === 'admin' || role === 'superadmin') && (
                <>
                    <AdminUsuario />
                    <Cruduser />
                </>
            )}

            {/* Siempre visible */}
            <LogoutSection />
        </div>
    )
}