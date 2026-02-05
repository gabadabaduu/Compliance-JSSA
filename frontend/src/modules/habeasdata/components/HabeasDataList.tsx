import { useState } from 'react';
import { Icon } from '@iconify/react';
import {
    useDsrsFiltered,
    useDeleteDsr,
    useTypesForFilter,
    useStagesForFilter,
    useStatusesForFilter,
    useRequestTypes
} from '../hooks/useHabeasData';
import type { Dsr } from '../types';
import TableFilter, { FilterConfig } from '../../cumplimiento/TableFilter';
import DetailModal from '../../cumplimiento/DetailModal';
import { usePermissions } from '../../../hooks/usePermissions';

interface HabeasDataListProps {
    dsrs: Dsr[];
    onEdit: (dsr: Dsr) => void;
}

export default function HabeasDataList({ dsrs: initialDsrs, onEdit }: HabeasDataListProps) {
    const { isSuperAdmin } = usePermissions();
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [selectedDsr, setSelectedDsr] = useState<Dsr | null>(null);

    const { data: dsrs } = useDsrsFiltered(filters);
    const { data: typesOptions } = useTypesForFilter();
    const { data: stagesOptions } = useStagesForFilter();
    const { data: statusesOptions } = useStatusesForFilter();
    const { data: requestTypes } = useRequestTypes();
    const deleteDsr = useDeleteDsr();

    // Función para obtener el nombre del tipo
    const getTypeName = (typeId: number): string => {
        const type = requestTypes?.find(t => t.id === typeId);
        return type?.type || typeId.toString();
    };

    // Función para determinar si se pueden mostrar botones de acción
    const canEditDsr = (dsr: Dsr): boolean => {
        if (isSuperAdmin) return true;
        // Aquí puedes agregar lógica adicional según tus necesidades
        return true;
    };

    const filterConfig: FilterConfig[] = [
        {
            key: 'type',
            label: 'Tipo',
            type: 'select',
            options: typesOptions || [],
        },
        {
            key: 'stage',
            label: 'Etapa',
            type: 'select',
            options: stagesOptions || [],
        },
        {
            key: 'status',
            label: 'Estado',
            type: 'select',
            options: statusesOptions || [],
        },
    ];

    const handleFilterChange = (newFilters: Record<string, any>) => {
        setFilters(newFilters);
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('¿Estás seguro de eliminar esta solicitud DSR?')) {
            try {
                await deleteDsr.mutateAsync(id);
            } catch (error) {
                console.error('Error al eliminar solicitud DSR:', error);
                alert('Error al eliminar la solicitud');
            }
        }
    };

    const handleRowClick = (dsr: Dsr) => {
        setSelectedDsr(dsr);
    };

    const handleEditClick = (dsr: Dsr, e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(dsr);
    };

    const formatDate = (date: Date | undefined | null) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('es-ES');
    };

    const formatDateTime = (date: Date | undefined | null) => {
        if (!date) return '-';
        return new Date(date).toLocaleString('es-ES');
    };

    const getDetailFields = (dsr: Dsr) => [
        { label: 'ID Caso', value: dsr.caseId },
        { label: 'ID Solicitud', value: dsr.requestId },
        { label: 'Tipo', value: getTypeName(dsr.type) },
        { label: 'Categoría', value: dsr.category || '-' },
        { label: 'Nombre Completo', value: dsr.fullName },
        { label: 'Tipo de ID', value: dsr.idType },
        { label: 'Número de ID', value: dsr.idNumber },
        { label: 'Email', value: dsr.email },
        { label: 'Fecha de Creación', value: formatDateTime(dsr.createdAt) },
        { label: 'Fecha de Inicio', value: formatDate(dsr.startDate) },
        { label: 'Fecha de Vencimiento', value: formatDate(dsr.dueDate) },
        { label: 'Etapa', value: dsr.stage ? formatDate(dsr.stage) : '-' },
        { label: 'Estado', value: dsr.status ? formatDate(dsr.status) : '-' },
        { label: 'Plazo Inicial', value: formatDate(dsr.initialTerm) },
        { label: 'Extensión de Plazo', value: dsr.extensionTerm ? 'Sí' : 'No' },
        { label: 'Plazo Total', value: formatDate(dsr.totalTerm) },
        { label: 'Fecha de Cierre', value: dsr.closedAt ? formatDate(dsr.closedAt) : '-' },
        { label: 'Detalles de la Solicitud', value: dsr.requestDetails, fullWidth: true },
        {
            label: 'Adjunto',
            value: dsr.attachment ? (
                <a href={dsr.attachment} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1">
                    <Icon icon="mdi:link-variant" width="16" height="16" />Ver documento
                </a>
            ) : '-',
            fullWidth: true
        },
        { label: 'Requiere Adjunto en Respuesta', value: dsr.responseAttachment ? 'Sí' : 'No' },
        { label: 'Creado Por', value: dsr.createdBy || '-' },
    ];

    const displayDsrs = dsrs || initialDsrs;

    if (displayDsrs.length === 0) {
        return (
            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-12">
                <TableFilter filters={filterConfig} onFilterChange={handleFilterChange} className="mb-6" />
                <div className="flex flex-col items-center text-center">
                    <Icon icon="mdi:shield-account-outline" width="64" height="64" className="text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                        No hay solicitudes DSR registradas
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Crea una nueva solicitud usando el botón superior
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
                        <Icon icon="mdi:format-list-bulleted" width="24" height="24" className="text-purple-400" />
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            Listado de Solicitudes DSR
                        </h2>
                        <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                            {displayDsrs.length}
                        </span>
                    </div>
                </div>

                <TableFilter filters={filterConfig} onFilterChange={handleFilterChange} className="mb-4" />

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha Creación</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha Inicio</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha Vencimiento</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Etapa</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {displayDsrs.map((dsr) => (
                                <tr
                                    key={dsr.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                                    onClick={() => handleRowClick(dsr)}
                                >
                                    <td className="py-4 px-4">
                                        <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                                            {getTypeName(dsr.type)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                            {dsr.fullName}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {formatDate(dsr.createdAt)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {formatDate(dsr.startDate)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {formatDate(dsr.dueDate)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {dsr.stage ? formatDate(dsr.stage) : '-'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {dsr.status ? formatDate(dsr.status) : '-'}
                                        </span>
                                    </td>

                                    {canEditDsr(dsr) && (
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={(e) => handleEditClick(dsr, e)}
                                                    className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Icon icon="mdi:pencil" width="18" height="18" className="text-purple-500" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(dsr.id, e)}
                                                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Eliminar"
                                                    disabled={deleteDsr.isPending}
                                                >
                                                    <Icon icon="mdi:delete" width="18" height="18" className="text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    )}

                                    {!canEditDsr(dsr) && (
                                        <td className="py-4 px-4">
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedDsr && (
                <DetailModal
                    isOpen={!!selectedDsr}
                    onClose={() => setSelectedDsr(null)}
                    title={`Solicitud DSR - ${selectedDsr.caseId}`}
                    icon="mdi:shield-account"
                    iconColor="text-purple-400"
                    fields={getDetailFields(selectedDsr)}
                />
            )}
        </>
    );
}