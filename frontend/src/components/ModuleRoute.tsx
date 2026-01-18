import { useUserStore } from '../stores/userStore'
import { UserPermissions } from '../types/user.types'
import { Icon } from '@iconify/react'
import { Link } from 'react-router-dom'

interface ModuleRouteProps {
    children: React.ReactNode
    requiredAccess: keyof UserPermissions
}

export default function ModuleRoute({ children, requiredAccess }: ModuleRouteProps) {
    const { hasAccess, userData } = useUserStore()

    if (!hasAccess(requiredAccess)) {
        return (
            <div className="min-h-full flex items-center justify-center p-8 bg-[#EFF2FB] dark:bg-[#1a1d29]">
                <div className="bg-white dark:bg-[#151824] rounded-xl p-10 text-center shadow-lg max-w-md">
                    <Icon 
                        icon="mdi:lock-outline" 
                        width="64" 
                        height="64" 
                        className="mx-auto text-blue-400 mb-4"
                    />
                    
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                        ¡Ups! Acceso restringido
                    </h2>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Parece que no tienes permisos para este módulo.
                    </p>
                    
                    <p className="text-gray-500 dark:text-gray-500 text-sm mb-6">
                        Contacta a tu administrador o mejora tu plan para acceder.
                    </p>

                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-6 py-3 px-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        Tu rol actual: <span className="font-semibold text-gray-700 dark:text-gray-300 capitalize">{userData?.role || 'desconocido'}</span>
                    </div>
                    
                    <Link 
                        to="/app/usuario" 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                    >
                        <Icon icon="mdi:arrow-left" width="20" height="20" />
                        Volver a mi cuenta
                    </Link>
                </div>
            </div>
        )
    }

    return <>{children}</>
}