import { Icon } from '@iconify/react';
import { useLatestRegulation } from '../hooks/useDashboard';

export default function UltiNorma() {
    const { data: regulation, isLoading, isError } = useLatestRegulation();

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-5 h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Icon icon="mdi:loading" width="24" height="24" className="animate-spin text-blue-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Cargando...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-5 h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Icon icon="mdi:alert-circle" width="24" height="24" className="text-red-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Error al cargar datos</span>
                </div>
            </div>
        );
    }

    if (!regulation) {
        return (
            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-5 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Icon icon="mdi:book-open-variant" width="18" height="18" className="text-blue-500" />
                    </div>
                    <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                        Última Normativa Agregada
                    </h3>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center py-4">
                    <Icon icon="mdi:book-off-outline" width="36" height="36" className="text-gray-300 dark:text-gray-600 mb-2" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">No hay normativas registradas</p>
                </div>
            </div>
        );
    }

    const issueDate = regulation.issueDate
        ? new Date(regulation.issueDate).toLocaleDateString('es-CO', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
        : 'N/A';

    const statusColor = regulation.status === 'Vigente'
        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';

    return (
        <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-5 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center shrink-0">
                    <Icon icon="mdi:book-open-variant" width="18" height="18" className="text-blue-500" />
                </div>
                <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                    Última Normativa Agregada
                </h3>
            </div>

            {/* Card */}
            <div className="bg-white dark:bg-[#1e2130] rounded-lg border-l-4 border-l-blue-500 shadow-sm px-5 py-4 flex-1">
                {/* Título + Estado */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-white leading-snug line-clamp-2">
                        {regulation.regulation}
                    </h4>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${statusColor}`}>
                        {regulation.status}
                    </span>
                </div>

                {/* Nombre común */}
                {regulation.commonName && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic line-clamp-1">
                        "{regulation.commonName}"
                    </p>
                )}

                {/* Título / Descripción */}
                {regulation.title && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-2">
                        {regulation.title}
                    </p>
                )}

                {/* Detalles */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-gray-500 dark:text-gray-400 mt-auto">
                    <div className="flex items-center gap-1.5">
                        <Icon icon="mdi:calendar" width="14" height="14" className="shrink-0" />
                        <span>{issueDate}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Icon icon="mdi:pound" width="14" height="14" className="shrink-0" />
                        <span>No. {regulation.number} de {regulation.year}</span>
                    </div>

                    {regulation.url && (
                        <a
                            href={regulation.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                            <Icon icon="mdi:open-in-new" width="14" height="14" className="shrink-0" />
                            <span>Ver documento</span>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}