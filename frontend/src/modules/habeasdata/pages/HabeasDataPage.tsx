import { Icon } from '@iconify/react';
import HabeasDataNamesList from '../components/HabeasDataNamesList';

export default function HabeasDataPage() {
    return (
       <div className="flex flex-col items-center justify-center min-h-full p-6">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-12">
                Habeas Data
            </h1>

            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-8 max-w-md w-full">
                <div className="flex flex-col items-center text-center">
                    <Icon 
                        icon="mdi:hammer-wrench" 
                        width="64" 
                        height="64" 
                        className="text-blue-400 mb-4"
                    />
                    
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                        Módulo en desarrollo
                    </h2>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Estamos trabajando para traerte nuevas funcionalidades. 
                        ¡Gracias por tu paciencia!
                    </p>

                    {/* Separador */}
                    <div className="w-full border-t border-gray-200 dark:border-gray-700 my-4"></div>

                    {/* Conexión con Supabase */}
                    <div className="w-full">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center justify-center gap-2">
                            <Icon icon="mdi:database" width="24" height="24" className="text-blue-400" />
                            Conexión con base de datos
                        </h3>
                        <div className="text-left">
                            <HabeasDataNamesList />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}