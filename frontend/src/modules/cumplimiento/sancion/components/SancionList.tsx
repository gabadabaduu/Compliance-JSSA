import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useSanctionsFiltered, useDeleteSanction, useEntitiesForFilter, useResolutionsForFilter } from '../hooks/useSancion';
import { getStatusColor, getStageColor, SANCTION_STATUS_LABELS, SANCTION_STAGE_LABELS, SANCTION_STAGES } from '../types';
import type { Sanction, SanctionStage, SanctionStatus } from '../types';
import TableFilter, { FilterConfig } from '../../TableFilter';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import DetailModal from '../../DetailModal';
import { usePermissions } from '../../../../hooks/usePermissions';

interface Props {
    onEdit: (sanction: Sanction) => void;
    onCreate: () => void;
}

export default function SancionList({ onEdit, onCreate }: Props) {
    const { isSuperAdmin } = usePermissions();
    const navigate = useNavigate();
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [searchText, setSearchText] = useState('');
    const [selectedSanction, setSelectedSanction] = useState<Sanction | null>(null);

    const { data: sanctions, isLoading, error } = useSanctionsFiltered(filters);
    const { data: entitiesOptions } = useEntitiesForFilter();
    const deleteSanction = useDeleteSanction();

    const filterBySearchText = (sanctions: Sanction[]): Sanction[] => {
        if (!searchText.trim()) return sanctions;

        const searchLower = searchText.toLowerCase().trim();

        return sanctions.filter((sanction) => {
            const searchableFields = [
                String(sanction.number || ''),
                String(sanction.entity || ''),
                String(sanction.facts || ''),
                String(SANCTION_STAGE_LABELS[sanction.stage] || sanction.stage || ''),
                String(SANCTION_STATUS_LABELS[sanction.status] || sanction.status || ''),
                String(sanction.initial || ''),
                String(sanction.reconsideration || ''),
                String(sanction.appeal || '')
            ];

            return searchableFields.some(field =>
                field.toLowerCase().includes(searchLower)
            );
        });
    };

    const filterConfig: FilterConfig[] = [
        {
            key: 'status',
            label: 'Estado',
            type: 'select',
            options: entitiesOptions || [],
        },
        {
            key: 'stage',
            label: 'Etapa',
            type: 'select',
            options: SANCTION_STAGES.map(s => ({ value: s, label: s })),
        },
    ];

    const handleFilterChange = (newFilters: Record<string, any>) => {
        setFilters(newFilters);
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('¿Estás seguro de eliminar esta sanción?')) return;
        try {
            await deleteSanction.mutateAsync(id);
        } catch (err) {
            console.error('Error al eliminar:', err);
            alert('Error al eliminar la sanción');
        }
    };

    const handleRowClick = (sanction: Sanction) => {
        setSelectedSanction(sanction);
    };

    const handleEditClick = (sanction: Sanction, e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(sanction);
    };

    const handleResolutionClick = (resolutionId: number | null, e: React.MouseEvent) => {
        e.stopPropagation();
        if (resolutionId) {
            navigate(`/app/resolucion?resolutionId=${resolutionId}`);
        }
    };

    const getStageStyle = (stage: SanctionStage) => {
        const color = getStageColor(stage);
        switch (color) {
            case 'blue': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
            case 'purple': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
            case 'red': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
            default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
        }
    };

    const getStatusStyle = (status: SanctionStatus) => {
        const color = getStatusColor(status);
        switch (color) {
            case 'green': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
            case 'orange': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
            default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
        }
    };

    const getDetailFields = (sanction: Sanction) => [
        { label: 'Número', value: sanction.number },
        { label: 'Entidad', value: sanction.entity },
        {
            label: 'Etapa',
            value: (
                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getStageStyle(sanction.stage)}`}>
                    {SANCTION_STAGE_LABELS[sanction.stage] || sanction.stage}
                </span>
            )
        },
        {
            label: 'Estado',
            value: (
                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getStatusStyle(sanction.status)}`}>
                    {SANCTION_STATUS_LABELS[sanction.status] || sanction.status}
                </span>
            )
        },
        { label: 'Resolución Inicial', value: sanction.initial ? `#${sanction.initial}` : '-' },
        { label: 'Recurso de Reposición', value: sanction.reconsideration ? `#${sanction.reconsideration}` : '-' },
        { label: 'Recurso de Apelación', value: sanction.appeal ? `#${sanction.appeal}` : '-' },
        { label: 'Hechos', value: sanction.facts, fullWidth: true },
    ];

    const baseSanctions = sanctions || [];
    const displaySanctions = filterBySearchText(baseSanctions);

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-12 flex items-center justify-center">
                <LoadingSpinner size="large" text="Cargando sanciones..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-center gap-3">
                <Icon icon="mdi:alert-circle" width="24" height="24" className="text-red-500" />
                <span className="text-red-700 dark:text-red-400">Error al cargar sanciones: {error.message}</span>
            </div>
        );
    }

    if (baseSanctions.length === 0) {
        return (
            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-12">
                <TableFilter filters={filterConfig} onFilterChange={handleFilterChange} className="mb-6" />
                <div className="flex flex-col items-center text-center">
                    <Icon icon="mdi:file-document-alert-outline" width="64" height="64" className="text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                        No hay sanciones registradas
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Crea una nueva sanción usando el botón superior
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Icon icon="mdi:format-list-bulleted" width="24" height="24" className="text-rose-400" />
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            Listado de Sanciones
                        </h2>
                        <span className="px-2 py-0.5 text-xs font-medium bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-full">
                            {displaySanctions.length}
                        </span>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icon icon="mdi:magnify" width="20" height="20" className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar en todas las columnas..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                        />
                        {searchText && (
                            <button
                                onClick={() => setSearchText('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <Icon icon="mdi:close-circle" width="20" height="20" className="text-gray-400" />
                            </button>
                        )}
                    </div>
                </div>

                <TableFilter filters={filterConfig} onFilterChange={handleFilterChange} className="mb-4" />

                {displaySanctions.length === 0 && searchText && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Icon icon="mdi:file-search-outline" width="64" height="64" className="text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                            No se encontraron resultados
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            No hay sanciones que coincidan con "<span className="font-semibold">{searchText}</span>"
                        </p>
                        <button
                            onClick={() => setSearchText('')}
                            className="text-sm text-rose-500 hover:text-rose-600 font-medium"
                        >
                            Limpiar búsqueda
                        </button>
                    </div>
                )}

                {displaySanctions.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Número</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sancionado</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Hechos</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Etapa</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Resolución Inicial</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Resolución de Reposición</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Resolución de Apelación</th>
                                    {/* ✅ COLUMNA DE ACCIONES SOLO PARA SUPERADMIN */}
                                    {isSuperAdmin && (
                                        <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {displaySanctions.map((sanction) => (
                                    <tr
                                        key={sanction.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                                        onClick={() => handleRowClick(sanction)}
                                    >
                                        <td className="py-4 px-4">
                                            <span className="font-mono text-sm font-medium text-gray-800 dark:text-gray-200">
                                                {sanction.number}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {sanction.entity}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 hidden lg:table-cell">
                                            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 max-w-md" title={sanction.facts}>
                                                {sanction.facts.length > 100 ? `${sanction.facts.substring(0, 100)}...` : sanction.facts}
                                            </p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getStageStyle(sanction.stage)}`}>
                                                {SANCTION_STAGE_LABELS[sanction.stage] || sanction.stage}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getStatusStyle(sanction.status)}`}>
                                                {SANCTION_STATUS_LABELS[sanction.status] || sanction.status}
                                            </span>
                                        </td>

                                        <td className="py-4 px-4 hidden md:table-cell">
                                            {sanction.initial ? (
                                                <button
                                                    onClick={(e) => handleResolutionClick(sanction.initial, e)}
                                                    className="text-sm text-blue-500 hover:text-blue-600 hover:underline font-medium flex items-center gap-1 transition-colors"
                                                    title="Ver resolución inicial"
                                                >
                                                    <Icon icon="mdi:file-document-outline" width="16" height="16" />
                                                    #{sanction.initial}
                                                </button>
                                            ) : (
                                                <span className="text-sm text-gray-400">-</span>
                                            )}
                                        </td>

                                        <td className="py-4 px-4 hidden md:table-cell">
                                            {sanction.reconsideration ? (
                                                <button
                                                    onClick={(e) => handleResolutionClick(sanction.reconsideration, e)}
                                                    className="text-sm text-blue-500 hover:text-blue-600 hover:underline font-medium flex items-center gap-1 transition-colors"
                                                    title="Ver recurso de reposición"
                                                >
                                                    <Icon icon="mdi:file-document-outline" width="16" height="16" />
                                                    #{sanction.reconsideration}
                                                </button>
                                            ) : (
                                                <span className="text-sm text-gray-400">-</span>
                                            )}
                                        </td>

                                        <td className="py-4 px-4 hidden md:table-cell">
                                            {sanction.appeal ? (
                                                <button
                                                    onClick={(e) => handleResolutionClick(sanction.appeal, e)}
                                                    className="text-sm text-blue-500 hover:text-blue-600 hover:underline font-medium flex items-center gap-1 transition-colors"
                                                    title="Ver recurso de apelación"
                                                >
                                                    <Icon icon="mdi:file-document-outline" width="16" height="16" />
                                                    #{sanction.appeal}
                                                </button>
                                            ) : (
                                                <span className="text-sm text-gray-400">-</span>
                                            )}
                                        </td>

                                        {/* ✅ CELDA DE ACCIONES SOLO PARA SUPERADMIN */}
                                        {isSuperAdmin && (
                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={(e) => handleEditClick(sanction, e)}
                                                        className="p-2 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Icon icon="mdi:pencil" width="18" height="18" className="text-rose-500" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDelete(sanction.id, e)}
                                                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Eliminar"
                                                        disabled={deleteSanction.isPending}
                                                    >
                                                        <Icon icon="mdi:delete" width="18" height="18" className="text-red-500" />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedSanction && (
                <DetailModal
                    isOpen={!!selectedSanction}
                    onClose={() => setSelectedSanction(null)}
                    title={`Sanción ${selectedSanction.number}`}
                    icon="mdi:file-document-alert-outline"
                    iconColor="text-rose-400"
                    fields={getDetailFields(selectedSanction)}
                />
            )}
        </>
    );
}