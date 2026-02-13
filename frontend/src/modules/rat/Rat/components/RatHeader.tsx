import { Icon } from '@iconify/react';

interface RopaTableHeaderProps {
    onCreateClick: () => void;
}

export default function RopaTableHeader({ onCreateClick }: RopaTableHeaderProps) {
    return (
        <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <Icon icon="mdi:table-large" width="32" height="32" className="text-purple-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            Registro de Actividades de Tratamiento
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Gestión del registro de actividades de tratamiento de datos personales
                        </p>
                    </div>
                </div>

                <button
                    onClick={onCreateClick}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors shadow-lg shadow-purple-500/25"
                >
                    <Icon icon="mdi:plus" width="20" height="20" />
                    Nuevo Registro
                </button>
            </div>
        </div>
    );
}