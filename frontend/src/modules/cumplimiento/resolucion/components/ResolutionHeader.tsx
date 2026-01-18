import { Icon } from '@iconify/react';

interface ResolutionHeaderProps {
    onCreateClick: () => void;
}

export default function ResolutionHeader({ onCreateClick }: ResolutionHeaderProps) {
    return (
        <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Info */}
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                        <Icon icon="mdi:gavel" width="32" height="32" className="text-amber-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            Resoluciones
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Gestión de resoluciones y sanciones
                        </p>
                    </div>
                </div>

                {/* Botón crear */}
                <button
                    onClick={onCreateClick}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors shadow-lg shadow-amber-500/25"
                >
                    <Icon icon="mdi:plus" width="20" height="20" />
                    Nueva Resolución
                </button>
            </div>
        </div>
    );
}