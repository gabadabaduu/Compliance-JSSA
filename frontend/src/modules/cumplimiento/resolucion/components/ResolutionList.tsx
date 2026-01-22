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
        if (window.confirm('¿Estás seguro de eliminar esta resolución? ')) {
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
                return 'bg-red-100 dark: bg-red-900/30 text-red-700 dark: text-red-300';
            case 'parcialmente-acogida':
                return 'bg-amber-100 dark: bg-amber-900/30 text-amber-700 dark: text-amber-300';
            default:
                return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
        }
    };

    if (resolutions.length === 0) {
        return (
            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-12">
                <div className="flex flex-col items-center text-center">
                    <Icon icon="mdi:file-document-alert-outline" width="64" height="64" className="text-gray-300 dark: text-gray-600 mb-4" />
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
                <Icon icon="mdi: format-list-bulleted" width="24" height="24" className="text-amber-400" />
                <h2 className="text-lg font-semibold text-gray-800 dark: text-gray-200">
                    Listado de Resoluciones
                </h2>
                <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
                    {resolutions.length}
                </span>
            </div>

            {/* ✅ Contenedor con scroll horizontal - TODAS LAS COLUMNAS VISIBLES */}
            <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                            {/* ✅ TODAS LAS COLUMNAS - ORDEN EXACTO DEL EXCEL */}
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">Sanctions</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[100px]">Number</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">Issue Date</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[80px]">Year</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[200px]">Resolution</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[150px]">Resolution Type</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">Infringements</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[250px]">Legal Grounds</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[130px]">Sanction Type</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">Amount</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[250px]">Description</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[150px]">Outcome</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[250px]">Orders</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">Attachment</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark: text-gray-400 uppercase tracking-wider min-w-[100px]">URL</th>
                            <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[150px] sticky right-0 bg-white dark:bg-[#151824]">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {resolutions.map((resolution) => (
                            <tr
                                key={resolution.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                                {/* 1. Sanctions */}
                                <td className="py-4 px-4">
                                    <span className="text-sm text-gray-700 dark: text-gray-300">
                                        {resolution.sanctions}
                                    </span>
                                </td>

                                {/* 2. Number */}
                                <td className="py-4 px-4">
                                    <span className="font-mono text-sm font-medium text-gray-800 dark:text-gray-200">
                                        {resolution.number}
                                    </span>
                                </td>

                                {/* 3. Issue Date */}
                                <td className="py-4 px-4">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {formatDate(resolution.issueDate)}
                                    </span>
                                </td>

                                {/* 4. Year */}
                                <td className="py-4 px-4">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {resolution.year}
                                    </span>
                                </td>

                                {/* 5. Resolution */}
                                <td className="py-4 px-4">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2" title={resolution.resolution}>
                                        {resolution.resolution}
                                    </p>
                                </td>

                                {/* 6. Resolution Type */}
                                <td className="py-4 px-4">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {resolution.resolutionType}
                                    </span>
                                </td>

                                {/* 7. Infringements */}
                                <td className="py-4 px-4">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        #{resolution.infringements}
                                    </span>
                                </td>

                                {/* 8. Legal Grounds */}
                                <td className="py-4 px-4">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2" title={resolution.legalGrounds}>
                                        {resolution.legalGrounds}
                                    </p>
                                </td>

                                {/* 9. Sanction Type */}
                                <td className="py-4 px-4">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        #{resolution.sanctionType}
                                    </span>
                                </td>

                                {/* 10. Amount */}
                                <td className="py-4 px-4">
                                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                        {formatCurrency(resolution.amount)}
                                    </span>
                                </td>

                                {/* 11. Description */}
                                <td className="py-4 px-4">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2" title={resolution.description}>
                                        {resolution.description}
                                    </p>
                                </td>

                                {/* 12. Outcome */}
                                <td className="py-4 px-4">
                                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getOutcomeStyle(resolution.outcome)}`}>
                                        {resolution.outcome}
                                    </span>
                                </td>

                                {/* 13. Orders */}
                                <td className="py-4 px-4">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2" title={resolution.orders}>
                                        {resolution.orders}
                                    </p>
                                </td>

                                {/* 14. Attachment */}
                                <td className="py-4 px-4">
                                    {resolution.attachment ? (
                                        <a
                                            href={resolution.attachment}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1"
                                        >
                                            <Icon icon="mdi:paperclip" width="16" height="16" />
                                            Ver
                                        </a>
                                    ) : (
                                        <span className="text-sm text-gray-400">-</span>
                                    )}
                                </td>

                                {/* 15. URL */}
                                <td className="py-4 px-4">
                                    {resolution.url ? (
                                        <a
                                            href={resolution.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-500 hover:text-blue-600 hover:underline"
                                        >
                                            <Icon icon="mdi:link-variant" width="18" height="18" className="inline" />
                                        </a>
                                    ) : (
                                        <span className="text-sm text-gray-400">-</span>
                                    )}
                                </td>

                                {/* 16. Acciones - STICKY para que siempre esté visible */}
                                <td className="py-4 px-4 sticky right-0 bg-white dark:bg-[#151824]">
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
                                            className="p-2 hover: bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
                                            title="Editar"
                                        >
                                            <Icon icon="mdi: pencil" width="18" height="18" className="text-amber-500" />
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