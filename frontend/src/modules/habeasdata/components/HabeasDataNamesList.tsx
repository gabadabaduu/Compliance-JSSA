import { Icon } from '@iconify/react';
import { useHabeasDataNames } from '../hooks/useHabeasDataNames';

export default function HabeasDataNamesList() {
    const { data, isPending, isError, error, refetch } = useHabeasDataNames();

    if (isPending) {
            return (
                <div className="flex items-center justify-center gap-2 py-4">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Cargando datos...</span>
                </div>
            );
        }
    
        if (isError) {
            return (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <Icon icon="mdi:alert-circle" width="20" height="20" className="text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-red-700 dark:text-red-400 font-medium text-sm mb-2">
                                Error de conexión
                            </p>
                            <p className="text-red-600 dark:text-red-300 text-xs mb-3">
                                {error.message}
                            </p>
                            <button 
                                onClick={() => refetch()}
                                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md transition-colors flex items-center gap-1"
                            >
                                <Icon icon="mdi:refresh" width="16" height="16" />
                                Reintentar
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
    
        return (
            <div className="space-y-2">
                {data && data.length > 0 ? (
                    <ul className="space-y-2">
                        {data.map(item => (
                            <li 
                                key={item.id} 
                                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-md"
                            >
                                <Icon icon="mdi:check-circle" width="16" height="16" className="text-green-500" />
                                {item.nombre}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm py-4">
                        <Icon icon="mdi:information-outline" width="18" height="18" />
                        No hay datos disponibles
                    </div>
                )}
            </div>
        );
    }