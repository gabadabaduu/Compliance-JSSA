import { Icon } from '@iconify/react';

interface NormativaHeaderProps {
    onCreateClick: () => void;
}

export default function NormativaHeader({ onCreateClick }: NormativaHeaderProps) {
    return (
        <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Info */}
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                        <Icon icon="mdi:scale-balance" width="32" height="32" className="text-indigo-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            Normativa
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Gestión de regulaciones y normativas aplicables
                        </p>
                    </div>
                </div>

                {/* Botón crear */}
                <button
                    onClick={onCreateClick}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/25"
                >
                    <Icon icon="mdi:plus" width="20" height="20" />
                    Nueva Normativa
                </button>
            </div>
        </div>
    );
}