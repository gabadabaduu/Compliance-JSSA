import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

export default function Dataflow() {
    const navigate = useNavigate();

    return (
        <div className="min-h-full p-6 space-y-6">
            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                            <Icon icon="mdi:swap-horizontal" width="32" height="32" className="text-purple-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                                Flujo de Datos
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Visualización del flujo de datos
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/app/rat')}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors"
                    >
                        <Icon icon="mdi:arrow-left" width="20" height="20" />
                        Volver
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-12">
                <div className="flex flex-col items-center justify-center text-center">
                    <Icon icon="mdi:construction" width="64" height="64" className="text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                        Próximamente
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Este módulo está en desarrollo
                    </p>
                </div>
            </div>
        </div>
    );
}