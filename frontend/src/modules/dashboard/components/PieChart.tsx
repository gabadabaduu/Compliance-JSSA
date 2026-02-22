import { useMemo } from 'react';
import { Icon } from '@iconify/react';
import { useDsrStatusSummary } from '../hooks/useDashboard';

// Pie chart SVG puro — sin dependencias extra
function PieChartSVG({ open, closed }: { open: number; closed: number }) {
    const total = open + closed;

    // Si no hay datos, mostrar círculo gris
    if (total === 0) {
        return (
            <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="80" fill="#e2e8f0" />
                <circle cx="100" cy="100" r="50" fill="white" className="dark:fill-[#151824]" />
            </svg>
        );
    }

    const openPct = open / total;
    const closedPct = closed / total;

    // Donut chart con stroke-dasharray
    const radius = 70;
    const circumference = 2 * Math.PI * radius;

    const openDash = openPct * circumference;
    const closedDash = closedPct * circumference;

    return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Base gris */}
            <circle
                cx="100" cy="100" r={radius}
                fill="none" stroke="#e2e8f0" strokeWidth="30"
                className="dark:stroke-gray-700"
            />

            {/* Segmento cerrado (verde) */}
            <circle
                cx="100" cy="100" r={radius}
                fill="none"
                stroke="#22c55e"
                strokeWidth="30"
                strokeDasharray={`${closedDash} ${circumference}`}
                strokeDashoffset="0"
                transform="rotate(-90 100 100)"
                className="transition-all duration-700"
            />

            {/* Segmento abierto (naranja) */}
            <circle
                cx="100" cy="100" r={radius}
                fill="none"
                stroke="#f97316"
                strokeWidth="30"
                strokeDasharray={`${openDash} ${circumference}`}
                strokeDashoffset={`${-closedDash}`}
                transform="rotate(-90 100 100)"
                className="transition-all duration-700"
            />

            {/* Centro hueco */}
            <circle cx="100" cy="100" r="55" fill="white" className="dark:fill-[#151824]" />

            {/* Texto central */}
            <text x="100" y="92" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="28" fontWeight="bold">
                {total}
            </text>
            <text x="100" y="115" textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="12">
                Total
            </text>
        </svg>
    );
}

export default function PieChart() {
    const { data: summary, isLoading, isError } = useDsrStatusSummary();

    const percentage = useMemo(() => {
        if (!summary || (summary.open + summary.closed) === 0) return { open: 0, closed: 0 };
        const total = summary.open + summary.closed;
        return {
            open: Math.round((summary.open / total) * 100),
            closed: Math.round((summary.closed / total) * 100),
        };
    }, [summary]);

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-4 h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Icon icon="mdi:loading" width="24" height="24" className="animate-spin text-green-400" />
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

    const open = summary?.open ?? 0;
    const closed = summary?.closed ?? 0;
    const total = open + closed;

    return (
        <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-4 h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center shrink-0">
                    <Icon icon="mdi:chart-pie" width="18" height="18" className="text-green-500" />
                </div>
                <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                    Estado de Peticiones
                </h3>
            </div>

            {total === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Icon icon="mdi:chart-pie" width="36" height="36" className="text-gray-300 dark:text-gray-600 mb-2" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">No hay peticiones registradas</p>
                </div>
            ) : (
                <div className="flex-1 flex items-center gap-4 min-h-0">
                    {/* Gráfico */}
                    <div className="w-28 h-28 shrink-0">
                        <PieChartSVG open={open} closed={closed} />
                    </div>

                    {/* Leyenda */}
                    <div className="flex flex-col gap-3 flex-1 min-w-0">
                        {/* Pendientes */}
                        <div className="flex items-center gap-2.5">
                            <div className="w-3 h-3 rounded-full bg-orange-500 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-xs text-gray-600 dark:text-gray-400">Pendientes</span>
                                    <span className="text-sm font-bold text-gray-800 dark:text-white">{open}</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                                    <div
                                        className="bg-orange-500 h-1.5 rounded-full transition-all duration-700"
                                        style={{ width: `${percentage.open}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Completadas */}
                        <div className="flex items-center gap-2.5">
                            <div className="w-3 h-3 rounded-full bg-green-500 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-xs text-gray-600 dark:text-gray-400">Completadas</span>
                                    <span className="text-sm font-bold text-gray-800 dark:text-white">{closed}</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                                    <div
                                        className="bg-green-500 h-1.5 rounded-full transition-all duration-700"
                                        style={{ width: `${percentage.closed}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Porcentaje completado */}
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                            {percentage.closed}% completado
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}