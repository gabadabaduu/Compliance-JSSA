import { useState, useEffect } from 'react'
import { userService, UserDto } from '../../../services/userService'

export default function UserManagementPage() {
    const [users, setUsers] = useState<UserDto[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const data = await userService.getAllUsers()
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
            await userService.deleteUser(userId)
            setSuccess('Usuario eliminado correctamente')
            fetchUsers()

            setTimeout(() => setSuccess(''), 3000)
        } catch (error: any) {
            console.error('Error deleting user:', error)
            setError(error.response?.data?.message || 'Error al eliminar usuario')
        }
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>

            {loading && <p>Cargando...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}

            <table className="w-full border mt-4">
                <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="p-2">Email</th>
                        <th className="p-2">Nombre</th>
                        <th className="p-2">Rol</th>
                        <th className="p-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} className="border-b">
                            <td className="p-2">{user.email}</td>
                            <td className="p-2">{user.fullName}</td>
                            <td className="p-2">{user.role}</td>
                            <td className="p-2">
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded"
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
    )
}
