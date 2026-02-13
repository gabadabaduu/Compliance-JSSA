import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { usuarioService } from '../../services/usuarioService'
import { UserDto } from '../../../../types/user.types'
import { useAuthStore } from '../../../../stores/authStore'
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner'

export default function AdminUsuario() {
    const [users, setUsers] = useState<UserDto[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')
    const [editingUser, setEditingUser] = useState<UserDto | null>(null)
    const [savingPermissions, setSavingPermissions] = useState<boolean>(false)
    const { user: currentUser } = useAuthStore()

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
                accessUsuario: editingUser.accessUsuario,
                updatedBy: currentUser?.id || ''
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
        { key: 'accessRat', label: 'RAT' },
        { key: 'accessHabeasdata', label: 'Habeas Data' },
        { key: 'accessAjustes', label: 'Ajustes' },
        { key: 'accessUsuario', label: 'Usuario' }
    ]

    const hasAnyAccess = (user: UserDto) => {
        return user.accessDashboard  || user.accessRat ||
             user.accessHabeasdata || 
            user.accessAjustes || user.accessUsuario
    }

    return (
        <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:account-group" width="28" height="28" className="text-blue-400" />
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        Gestión de Usuarios
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Administra los usuarios y sus permisos
                    </p>
                </div>
            </div>

            {/* Mensajes */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
                    <Icon icon="mdi:alert-circle" width="20" height="20" className="text-red-500" />
                    <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
                </div>
            )}
            {success && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
                    <Icon icon="mdi:check-circle" width="20" height="20" className="text-green-500" />
                    <span className="text-sm text-green-700 dark:text-green-400">{success}</span>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex justify-center py-8">
                    <LoadingSpinner size="medium" text="Cargando usuarios..." />
                </div>
            )}

            {/* Tabla */}
            {!loading && (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Nombre</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Rol</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Módulos</th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{user.email}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{user.fullName || '-'}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            user.role === 'superadmin' 
                                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                                : user.role === 'admin'
                                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-wrap gap-1">
                                            {user.accessDashboard && <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">Dashboard</span>}
                                            {user.accessRat && <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">RAT</span>}
                                            {user.accessHabeasdata && <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">Habeas</span>}
                                            {user.accessAjustes && <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">Ajustes</span>}
                                            {!hasAnyAccess(user) && <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 rounded">Sin acceso</span>}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleEditPermissions(user)}
                                                className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                title="Editar permisos"
                                            >
                                                <Icon icon="mdi:shield-edit" width="20" height="20" className="text-blue-500" />
                                            </button>
                                            {user.role !== 'superadmin' && (
                                                <button
                                                    onClick={() => handleDeleteUser(user.id, user.email)}
                                                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                    title="Eliminar usuario"
                                                >
                                                    <Icon icon="mdi:delete" width="20" height="20" className="text-red-500" />
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

            {/* Modal de permisos */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCancelEdit} />
                    <div className="relative bg-white dark:bg-[#151824] rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                    Editar Permisos
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {editingUser.email}
                                </p>
                            </div>
                            <button onClick={handleCancelEdit} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                <Icon icon="mdi:close" width="24" height="24" className="text-gray-500" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {permissionsList.map(({ key, label }) => (
                                <label
                                    key={key}
                                    className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={Boolean(editingUser[key])}
                                        onChange={() => handlePermissionChange(key)}
                                        disabled={savingPermissions}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                                </label>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelEdit}
                                disabled={savingPermissions}
                                className="flex-1 h-[40px] bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSavePermissions}
                                disabled={savingPermissions}
                                className="flex-1 h-[40px] bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 flex items-center justify-center"
                            >
                                {savingPermissions ? <LoadingSpinner size="small" /> : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}