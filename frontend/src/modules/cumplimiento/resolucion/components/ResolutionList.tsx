import { Icon } from '@iconify/react';
import { useDeleteResolution } from '../hooks/useResolution';
import type { Resolution } from '../types';

interface ResolutionListProps {
    resolutions: Resolution[];
    onEdit: (resolution: Resolution) => void;
}

export default function ResolutionList({ resolutions, onEdit }: ResolutionListProps) {
    const deleteResolution = useDeleteResolution();

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar esta resolución?')) {
            try {
                await deleteResolution.mutateAsync(id);
            } catch (error) {
                console.error('Error al eliminar resolución:', error);
                alert('Error al eliminar la resolución');
            }
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('es-ES');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP'
        }).format(amount);
    };

    const getOutcomeStyle = (outcome: string) => {
        const normalizedOutcome = outcome.toLowerCase().replace(/\s/g, '-');
        switch (normalizedOutcome) {
            case 'acogida':
                return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
            case 'no-acogida':
                return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
            case 'parcialmente-acogida':
                return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
            default:
                return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
        }
    };

    if (resolutions.length === 0) {
        return (
            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-12">
                <div className="flex flex-col items-center text-center">
                    <Icon icon="mdi:file-document-alert-outline" width="64" height="64" className="text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                        No hay resoluciones registradas
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Crea una nueva resolución usando el botón superior
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-6">
            {/* Header de la tabla */}
            <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:format-list-bulleted" width="24" height="24" className="text-amber-400" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Listado de Resoluciones
                </h2>
                <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
                    {resolutions.length}
                </span>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Número</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sanciones</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Año</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Fecha</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Monto</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resultado</th>
                            <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {resolutions.map((resolution) => (
                            <tr 
                                key={resolution.id} 
                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                                <td className="py-4 px-4">
                                    <span className="font-mono text-sm font-medium text-gray-800 dark:text-gray-200">
                                        {resolution.number}
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2" title={resolution.sanctions}>
                                        {resolution.sanctions}
                                    </p>
                                </td>
                                <td className="py-4 px-4">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {resolution.year}
                                    </span>
                                </td>
                                <td className="py-4 px-4 hidden md:table-cell">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {formatDate(resolution.issueDate)}
                                    </span>
                                </td>
                                <td className="py-4 px-4 hidden lg:table-cell">
                                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                        {formatCurrency(resolution.amount)}
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getOutcomeStyle(resolution.outcome)}`}>
                                        {resolution.outcome}
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center justify-center gap-1">
                                        {resolution.url && (
                                            <a
                                                href={resolution.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                title="Ver documento"
                                            >
                                                <Icon icon="mdi:open-in-new" width="18" height="18" className="text-blue-500" />
                                            </a>
                                        )}
                                        <button
                                            onClick={() => onEdit(resolution)}
                                            className="p-2 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
                                            title="Editar"
                                        >
                                            <Icon icon="mdi:pencil" width="18" height="18" className="text-amber-500" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(resolution.id)}
                                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                                            title="Eliminar"
                                            disabled={deleteResolution.isPending}
                                        >
                                            <Icon icon="mdi:delete" width="18" height="18" className="text-red-500" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}