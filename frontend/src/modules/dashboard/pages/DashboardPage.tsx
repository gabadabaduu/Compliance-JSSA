import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../stores/authStore'

export default function DashboardPage() {
    const navigate = useNavigate()
    const { user, logout } = useAuthStore()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header con logout */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-sm text-gray-600">Bienvenido, {user?.email}</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/change-password')}
                            className="text-sm text-gray-600 hover:text-gray-900 transition"
                        >
                            Cambiar contraseña
                        </button>

                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </header>

            {/* Contenido del dashboard */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Contenido del Dashboard</h2>
                    <p className="text-gray-600">Aquí va el contenido de tu aplicación...</p>
                </div>
            </main>
        </div>
    )
}