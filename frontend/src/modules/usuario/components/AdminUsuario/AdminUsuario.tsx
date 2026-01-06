import { useState, useEffect } from 'react'
import { usuarioService } from '../../services/usuarioService'
import { UserDto } from '../../../../types/user.types'
import './AdminUsuario.css'

export default function AdminUsuario() {
    const [users, setUsers] = useState<UserDto[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')
    const [editingUser, setEditingUser] = useState<UserDto | null>(null)
    const [savingPermissions, setSavingPermissions] = useState<boolean>(false)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const data = await usuarioService.getAllUsers()
            setUsers(data)
            setError('')
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

    const handleEditPermissions = (user: UserDto) => {
        setEditingUser({ ...user })
        setError('')
        setSuccess('')
    }

    const handleCancelEdit = () => {
        setEditingUser(null)
    }

    const handlePermissionChange = (permission: keyof UserDto) => {
        if (!editingUser) return

        setEditingUser({
            ...editingUser,
            [permission]: !editingUser[permission]
        })
    }

    const handleSavePermissions = async () => {
        if (!editingUser) return

        setSavingPermissions(true)
        setError('')

        try {
            await usuarioService.updatePermissions(editingUser.id, {
                accessDashboard: editingUser.accessDashboard,
                accessEpid: editingUser.accessEpid,
                accessRat: editingUser.accessRat,
                accessNormograma: editingUser.accessNormograma,
                accessHabeasdata: editingUser.accessHabeasdata,
                accessMatrizriesgo: editingUser.accessMatrizriesgo,
                accessAjustes: editingUser.accessAjustes,
                accessUsuario: editingUser.accessUsuario
            })

            setSuccess(`Permisos actualizados para ${editingUser.email}`)
            setEditingUser(null)
            fetchUsers()

            setTimeout(() => setSuccess(''), 3000)
        } catch (error: any) {
            console.error('Error updating permissions:', error)
            setError(error.response?.data?.message || 'Error al actualizar permisos')
        } finally {
            setSavingPermissions(false)
        }
    }

    const permissionsList: { key: keyof UserDto; label: string }[] = [
        { key: 'accessDashboard', label: 'Dashboard' },
        { key: 'accessEpid', label: 'EPID' },
        { key: 'accessRat', label: 'RAT' },
        { key: 'accessNormograma', label: 'Normograma' },
        { key: 'accessHabeasdata', label: 'Habeas Data' },
        { key: 'accessMatrizriesgo', label: 'Matriz Riesgo' },
        { key: 'accessAjustes', label: 'Ajustes' },
        { key: 'accessUsuario', label: 'Usuario' }
    ]

    const hasAnyAccess = (user: UserDto) => {
        return user.accessDashboard || user.accessEpid || user.accessRat ||
            user.accessNormograma || user.accessHabeasdata || user.accessMatrizriesgo ||
            user.accessAjustes || user.accessUsuario
    }

    return (
        <div className="crud-usuario-section">
            <div className="crud-usuario-header">
                <h2>Gestión de Usuarios</h2>
                <p>Administra los usuarios y sus permisos</p>
            </div>

            {loading && <p className="loading-text">Cargando...</p>}
            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}

            {/* Modal de edición de permisos */}
            {editingUser && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Editar Permisos</h3>
                            <p className="modal-subtitle">{editingUser.email}</p>
                        </div>

                        <div className="permissions-grid">
                            {permissionsList.map(({ key, label }) => (
                                <label key={key} className="permission-item">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(editingUser[key])}
                                        onChange={() => handlePermissionChange(key)}
                                        disabled={savingPermissions}
                                    />
                                    <span className="permission-label">{label}</span>
                                </label>
                            ))}
                        </div>

                        <div className="modal-actions">
                            <button
                                className="btn-cancel"
                                onClick={handleCancelEdit}
                                disabled={savingPermissions}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn-save"
                                onClick={handleSavePermissions}
                                disabled={savingPermissions}
                            >
                                {savingPermissions ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabla de usuarios */}
            {!loading && (
                <div className="table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Nombre</th>
                                <th>Empresa</th>
                                <th>Rol</th>
                                <th>Módulos</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.email}</td>
                                    <td>{user.fullName || '-'}</td>
                                    <td>{user.nombreEmpresa || '-'}</td>
                                    <td>
                                        <span className={`role-badge role-${user.role}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="modules-badges">
                                            {user.accessDashboard && <span className="module-badge">Dashboard</span>}
                                            {user.accessEpid && <span className="module-badge">EPID</span>}
                                            {user.accessRat && <span className="module-badge">RAT</span>}
                                            {user.accessNormograma && <span className="module-badge">Normograma</span>}
                                            {user.accessHabeasdata && <span className="module-badge">Habeas</span>}
                                            {user.accessMatrizriesgo && <span className="module-badge">Matriz</span>}
                                            {user.accessAjustes && <span className="module-badge">Ajustes</span>}
                                            {user.accessUsuario && <span className="module-badge">Usuario</span>}
                                            {!hasAnyAccess(user) && (
                                                <span className="no-modules">Sin acceso</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-edit"
                                                onClick={() => handleEditPermissions(user)}
                                                title="Editar permisos"
                                            >
                                                ✏️ Permisos
                                            </button>
                                            {user.role !== 'superadmin' && (
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => handleDeleteUser(user.id, user.email)}
                                                    title="Eliminar usuario"
                                                >
                                                    🗑️
                                                </button>
                                            )}
                                        </div>
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