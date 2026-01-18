import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../../stores/authStore'
import { Icon } from '@iconify/react'
import CrudUsuario from '../CrudUsuario/CrudUsuario'

interface UserProfileCardProps {
    showCreateUser?: boolean
}

export default function UserProfileCard({ showCreateUser = false }: UserProfileCardProps) {
    const navigate = useNavigate()
    const { user, logout } = useAuthStore()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <>
            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Info del usuario */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <Icon icon="mdi:account" width="32" height="32" className="text-blue-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                Sesión activa
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex items-center gap-3">
                        {showCreateUser && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                            >
                                <Icon icon="mdi:account-plus" width="20" height="20" />
                                Crear Usuario
                            </button>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors"
                        >
                            <Icon icon="mdi:logout" width="20" height="20" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de crear usuario */}
            <CrudUsuario
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </>
    )
}