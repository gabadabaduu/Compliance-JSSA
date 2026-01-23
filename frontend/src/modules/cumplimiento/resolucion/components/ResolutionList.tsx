import { useState } from 'react';
import { Icon } from '@iconify/react';
import { 
    useResolutionsFiltered, 
    useDeleteResolution,
    useSanctionsForFilter,
    useYearsForFilter,
    useResolutionTypesForFilter,
    useInfringementsForFilter,
    useSanctionTypesForFilter,
    useOutcomesForFilter
} from '../hooks/useResolution';
import type { Resolution } from '../types';
import TableFilter, { FilterConfig } from '../../TableFilter';
import DetailModal from '../../DetailModal';

interface ResolutionListProps {
    resolutions: Resolution[];
    onEdit: (resolution: Resolution) => void;
}

export default function ResolutionList({ resolutions: initialResolutions, onEdit }: ResolutionListProps) {
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [selectedResolution, setSelectedResolution] = useState<Resolution | null>(null);
    
    const { data: resolutions } = useResolutionsFiltered(filters);
    const { data: sanctionsOptions } = useSanctionsForFilter();
    const { data: yearsOptions } = useYearsForFilter();
    const { data: resolutionTypesOptions } = useResolutionTypesForFilter();
    const { data: infringementsOptions } = useInfringementsForFilter();
    const { data: sanctionTypesOptions } = useSanctionTypesForFilter();
    const { data: outcomesOptions } = useOutcomesForFilter();
    const deleteResolution = useDeleteResolution();

    // Configuración de filtros
    const filterConfig: FilterConfig[] = [
        {
            key: 'sanctions',
            label: 'Sanción',
            type: 'select',
            options: sanctionsOptions || [],
        },
        {
            key: 'issueDate',
            label: 'Fecha Emisión',
            type: 'date',
        },
        {
            key: 'year',
            label: 'Año',
            type: 'select',
            options: yearsOptions || [],
        },
        {
            key: 'resolutionType',
            label: 'Tipo Resolución',
            type: 'select',
            options: resolutionTypesOptions || [],
        },
        {
            key: 'infringements',
            label: 'Infracción',
            type: 'select',
            options: infringementsOptions || [],
        },
        {
            key: 'sanctionType',
            label: 'Tipo Sanción',
            type: 'select',
            options: sanctionTypesOptions || [],
        },
        {
            key: 'outcome',
            label: 'Resultado',
            type: 'select',
            options: outcomesOptions || [],
        },
    ];

    const handleFilterChange = (newFilters: Record<string, any>) => {
        setFilters(newFilters);
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('¿Estás seguro de eliminar esta resolución?')) {
            try {
                await deleteResolution.mutateAsync(id);
            } catch (error) {
                console.error('Error al eliminar resolución:', error);
                alert('Error al eliminar la resolución');
            }
        }
    };

    const handleRowClick = (resolution: Resolution) => {
        setSelectedResolution(resolution);
    };

    const handleEditClick = (resolution: Resolution, e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(resolution);
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

    // Campos para el modal de detalle
    const getDetailFields = (resolution: Resolution) => [
        { label: 'Sanción', value: resolution.sanctions },
        { label: 'Número', value: resolution.number },
        { label: 'Fecha de Emisión', value: formatDate(resolution.issueDate) },
        { label: 'Año', value: resolution.year },
        { label: 'Tipo de Resolución', value: resolution.resolutionType },
        { label: 'Infracción', value: `#${resolution.infringements}` },
        { label: 'Tipo de Sanción', value: `#${resolution.sanctionType}` },
        { label: 'Monto', value: formatCurrency(resolution.amount) },
        { 
            label: 'Resultado', 
            value: (
                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getOutcomeStyle(resolution.outcome)}`}>
                    {resolution.outcome}
                </span>
            )
        },
        { label: 'Resolución', value: resolution.resolution, fullWidth: true },
        { label: 'Fundamentos Legales', value: resolution.legalGrounds, fullWidth: true },
        { label: 'Descripción', value: resolution.description, fullWidth: true },
        { label: 'Órdenes', value: resolution.orders, fullWidth: true },
        { 
            label: 'Adjunto', 
            value: resolution.attachment ? (
                <a href={resolution.attachment} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1">
                    <Icon icon="mdi:paperclip" width="16" height="16" />Ver adjunto
                </a>
            ) : '-'
        },
        { 
            label: 'URL', 
            value: resolution.url ? (
                <a href={resolution.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1">
                    <Icon icon="mdi:link-variant" width="16" height="16" />Ver enlace
                </a>
            ) : '-'
        },
    ];

    const displayResolutions = resolutions || initialResolutions;

    if (displayResolutions.length === 0) {
        return (
            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-12">
                <TableFilter filters={filterConfig} onFilterChange={handleFilterChange} className="mb-6" />
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
        <>
            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-6">
                {/* Header de la tabla */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Icon icon="mdi:format-list-bulleted" width="24" height="24" className="text-amber-400" />
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            Listado de Resoluciones
                        </h2>
                        <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
                            {displayResolutions.length}
                        </span>
                    </div>
                </div>

                {/* Filtros */}
                <TableFilter filters={filterConfig} onFilterChange={handleFilterChange} className="mb-4" />

                {/* Tabla */}
                <div className="overflow-x-auto -mx-6 px-6">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-200 dark:border-gray-700">
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
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[100px]">URL</th>
                                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[150px] sticky right-0 bg-white dark:bg-[#151824]">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {displayResolutions.map((resolution) => (
                                <tr 
                                    key={resolution.id} 
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                                    onClick={() => handleRowClick(resolution)}
                                >
                                    <td className="py-4 px-4"><span className="text-sm text-gray-700 dark:text-gray-300">{resolution.sanctions}</span></td>
                                    <td className="py-4 px-4"><span className="font-mono text-sm font-medium text-gray-800 dark:text-gray-200">{resolution.number}</span></td>
                                    <td className="py-4 px-4"><span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(resolution.issueDate)}</span></td>
                                    <td className="py-4 px-4"><span className="text-sm text-gray-600 dark:text-gray-400">{resolution.year}</span></td>
                                    <td className="py-4 px-4"><p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2" title={resolution.resolution}>{resolution.resolution}</p></td>
                                    <td className="py-4 px-4"><span className="text-sm text-gray-700 dark:text-gray-300">{resolution.resolutionType}</span></td>
                                    <td className="py-4 px-4"><span className="text-sm text-gray-600 dark:text-gray-400">#{resolution.infringements}</span></td>
                                    <td className="py-4 px-4"><p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2" title={resolution.legalGrounds}>{resolution.legalGrounds}</p></td>
                                    <td className="py-4 px-4"><span className="text-sm text-gray-600 dark:text-gray-400">#{resolution.sanctionType}</span></td>
                                    <td className="py-4 px-4"><span className="text-sm font-medium text-gray-800 dark:text-gray-200">{formatCurrency(resolution.amount)}</span></td>
                                    <td className="py-4 px-4"><p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2" title={resolution.description}>{resolution.description}</p></td>
                                    <td className="py-4 px-4"><span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getOutcomeStyle(resolution.outcome)}`}>{resolution.outcome}</span></td>
                                    <td className="py-4 px-4"><p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2" title={resolution.orders}>{resolution.orders}</p></td>
                                    <td className="py-4 px-4">
                                        {resolution.attachment ? (
                                            <a 
                                                href={resolution.attachment} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-sm text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Icon icon="mdi:paperclip" width="16" height="16" />Ver
                                            </a>
                                        ) : (<span className="text-sm text-gray-400">-</span>)}
                                    </td>
                                    <td className="py-4 px-4">
                                        {resolution.url ? (
                                            <a 
                                                href={resolution.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-sm text-blue-500 hover:text-blue-600 hover:underline"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Icon icon="mdi:link-variant" width="18" height="18" className="inline" />
                                            </a>
                                        ) : (<span className="text-sm text-gray-400">-</span>)}
                                    </td>
                                    <td className="py-4 px-4 sticky right-0 bg-white dark:bg-[#151824]">
                                        <div className="flex items-center justify-center gap-1">
                                            {resolution.url && (
                                                <a 
                                                    href={resolution.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors" 
                                                    title="Ver documento"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Icon icon="mdi:open-in-new" width="18" height="18" className="text-blue-500" />
                                                </a>
                                            )}
                                            <button 
                                                onClick={(e) => handleEditClick(resolution, e)} 
                                                className="p-2 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors" 
                                                title="Editar"
                                            >
                                                <Icon icon="mdi:pencil" width="18" height="18" className="text-amber-500" />
                                            </button>
                                            <button 
                                                onClick={(e) => handleDelete(resolution.id, e)} 
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

            {/* Modal de detalle */}
            {selectedResolution && (
                <DetailModal
                    isOpen={!!selectedResolution}
                    onClose={() => setSelectedResolution(null)}
                    title={`Resolución ${selectedResolution.number}`}
                    icon="mdi:file-document-check-outline"
                    iconColor="text-amber-400"
                    fields={getDetailFields(selectedResolution)}
                />
            )}
        </>
    );
}