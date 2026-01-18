import { Icon } from '@iconify/react';
import ChangePasswordSection from '../../usuario/components/ChangePasswordSection/ChangePasswordSection';

export default function AjustesPage() {
    return (
        <div className="min-h-full p-0">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-10 text-center">
                Ajustes
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                {/* Card de cambio de contraseña */}
                <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Icon icon="mdi:lock-outline" width="28" height="28" className="text-blue-400" />
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                            Seguridad
                        </h2>
                    </div>
                    <ChangePasswordSection />
                </div>

                {/* Módulo en desarrollo */}
                <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-8">
                    <div className="flex flex-col items-center justify-center text-center h-full">
                        <Icon 
                            icon="mdi:hammer-wrench" 
                            width="64" 
                            height="64" 
                            className="text-blue-400 mb-4"
                        />
                        
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                            Más opciones próximamente
                        </h2>
                        
                        <p className="text-gray-600 dark:text-gray-400">
                            Estamos trabajando en nuevas configuraciones para ti.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}