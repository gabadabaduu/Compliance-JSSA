import { Icon } from '@iconify/react';
import { useNextDueDsr } from '../hooks/useDashboard';

export default function PeticionProx() {
    const { data: dsr, isLoading, isError } = useNextDueDsr();

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-4 h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Icon icon="mdi:loading" width="24" height="24" className="animate-spin text-orange-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Cargando...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-4 h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Icon icon="mdi:alert-circle" width="24" height="24" className="text-red-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Error al cargar datos</span>
                </div>
            </div>
        );
    }

    if (!dsr) {
        return (
            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-4 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                        <Icon icon="mdi:clock-alert" width="18" height="18" className="text-orange-500" />
                    </div>
                    <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                        Próxima a Vencer
                    </h3>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Icon icon="mdi:check-circle-outline" width="32" height="32" className="text-green-300 dark:text-green-700 mb-2" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">No hay peticiones próximas a vencer</p>
                </div>
            </div>
        );
    }

    const days = dsr.daysBeforeDue;
    const isExpired = days < 0;
    const isToday = days === 0;
    const isUrgent = days === 1;

    const urgencyText = isExpired
        ? `Venció hace ${Math.abs(days)} día(s)`
        : isToday
            ? 'Vence hoy'
            : `Vence en ${days} día(s)`;

    const urgencyBadgeColor = isExpired || isToday
        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        : isUrgent
            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';

    const borderColor = isExpired || isToday
        ? 'border-l-red-500'
        : isUrgent
            ? 'border-l-orange-500'
            : 'border-l-yellow-500';

    const headerIconColor = isExpired || isToday
        ? 'text-red-500'
        : isUrgent
            ? 'text-orange-500'
            : 'text-yellow-500';

    const headerBgColor = isExpired || isToday
        ? 'bg-red-100 dark:bg-red-900/30'
        : isUrgent
            ? 'bg-orange-100 dark:bg-orange-900/30'
            : 'bg-yellow-100 dark:bg-yellow-900/30';

    const dueDate = dsr.dueDate
        ? new Date(dsr.dueDate).toLocaleDateString('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
        : 'N/A';

    return (
        <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-4 h-full flex flex-col overflow-hidden">
            {/* Header compacto */}
            <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 ${headerBgColor} rounded-lg flex items-center justify-center shrink-0`}>
                    <Icon icon="mdi:clock-alert" width="18" height="18" className={headerIconColor} />
                </div>
                <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                    Próxima a Vencer
                </h3>
            </div>

            {/* Card compacta */}
            <div className={`bg-white dark:bg-[#1e2130] rounded-lg border-l-4 ${borderColor} shadow-sm px-4 py-3 flex-1 flex flex-col min-h-0 overflow-hidden`}>
                {/* Cabecera */}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-800 dark:text-white truncate mr-2">
                        {dsr.caseId ? `Rad. ${dsr.caseId}` : `DSR #${dsr.dsrId}`}
                    </span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${urgencyBadgeColor}`}>
                        {urgencyText}
                    </span>
                </div>

                {/* Descripción */}
                {(dsr.requestType || dsr.fullName) && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                        {dsr.requestType && dsr.fullName
                            ? <>Solicitud de <strong>{dsr.requestType}</strong> — <strong>{dsr.fullName}</strong></>
                            : dsr.fullName
                                ? <>Titular: <strong>{dsr.fullName}</strong></>
                                : <>Tipo: <strong>{dsr.requestType}</strong></>
                        }
                    </p>
                )}

                {/* Detalles compactos */}
                <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <div className="flex items-center gap-1.5">
                        <Icon icon="mdi:calendar-clock" width="14" height="14" className="shrink-0" />
                        <span>Límite: <strong className={isExpired || isToday ? 'text-red-500' : ''}>{dueDate}</strong></span>
                    </div>

                    {dsr.status && (
                        <div className="flex items-center gap-1.5">
                            <Icon icon="mdi:information-outline" width="14" height="14" className="shrink-0" />
                            <span>Estado: <strong>{dsr.status}</strong></span>
                        </div>
                    )}

                    {dsr.tenant && (
                        <div className="flex items-center gap-1.5">
                            <Icon icon="mdi:domain" width="14" height="14" className="shrink-0" />
                            <span className="truncate">{dsr.tenant}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}