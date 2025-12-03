import { useState, useEffect } from 'react'
import { usuarioService } from '../../services/usuarioService'
import { UserDto } from '../../../../types/user.types'
import './CrudUsuario.css'

export default function CrudUsuario() {
    const [users, setUsers] = useState<UserDto[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const data = await usuarioService.getAllUsers()
            setUsers(data)
        } catch (error: any) {
            console.error('Error fetching users:', error)
            setError(error.response?.data?.message || 'Error al cargar usuarios')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteUser = async (userId: string, userEmail: string) => {
        if (!confirm(`¿Estás seguro de eliminar al usuario ${userEmail}?`)) return

        try {
            await usuarioService.deleteUser(userId)
            setSuccess('Usuario eliminado correctamente')
            fetchUsers()

            setTimeout(() => setSuccess(''), 3000)
        } catch (error: any) {
            console.error('Error deleting user:', error)
            setError(error.response?.data?.message || 'Error al eliminar usuario')
        }
    }

    return (
        <div className="crud-usuario-section">
            <div className="crud-usuario-header">
                <h2>Gestión de Usuarios</h2>
                <p>Administra los usuarios del sistema</p>
            </div>

            {loading && <p className="loading-text">Cargando...</p>}
            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}

            {!loading && (
                <div className="table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Nombre</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.email}</td>
                                    <td>{user.fullName || '-'}</td>
                                    <td>
                                        <span className={`role-badge role-${user.role}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDeleteUser(user.id, user.email)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}