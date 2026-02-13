import { useState } from 'react';
import { Icon } from '@iconify/react';
import {
    useRopaTableFiltered,
    useDeleteRopaTable,
    useProcessOwnerFilter,
    useDataCategoriesFilter,
    useDataSharedFilter,
    useRopaSystems,
    useRopaDepartments,
    useRopaDataTypes,
    useRopaSubjectCategories,
    useRopaPurposes,
    useRopaStorageLookup,
    useRopaDataFlow,
} from '../hooks/useRat';
import type { RopaTable, RopaLookup } from '../types';
import TableFilter, { type FilterConfig } from '../../../cumplimiento/TableFilter';
import DetailModal from '../../DetailModal';

interface RopaTableListProps {
    records: RopaTable[];
    onEdit: (record: RopaTable) => void;
}

export default function RopaTableList({ records: initialRecords, onEdit }: RopaTableListProps) {
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [selectedRecord, setSelectedRecord] = useState<RopaTable | null>(null);

    const { data: records } = useRopaTableFiltered(filters);
    const { data: processOwnerOptions } = useProcessOwnerFilter();
    const { data: dataCategoriesOptions } = useDataCategoriesFilter();
    const { data: dataSharedOptions } = useDataSharedFilter();
    const { data: systems } = useRopaSystems();
    const { data: departments } = useRopaDepartments();
    const { data: dataTypes } = useRopaDataTypes();
    const { data: subjectCategories } = useRopaSubjectCategories();
    const { data: purposes } = useRopaPurposes();
    const { data: storage } = useRopaStorageLookup();
    const { data: dataFlow } = useRopaDataFlow();
    const deleteRecord = useDeleteRopaTable();

    const getLookupName = (list: RopaLookup[] | undefined, id: number | null | undefined): string => {
        if (!id || !list) return '-';
        return list.find(item => item.id === id)?.name || id.toString();
    };

    const filterConfig: FilterConfig[] = [
        {
            key: 'processOwner',
            label: 'Responsable',
            type: 'select',
            options: processOwnerOptions || [],
        },
        {
            key: 'dataCategories',
            label: 'Categoría de Dato',
            type: 'select',
            options: dataCategoriesOptions || [],
        },
        {
            key: 'dataShared',
            label: 'Dato Compartido',
            type: 'select',
            options: dataSharedOptions || [],
        },
    ];

    const handleFilterChange = (newFilters: Record<string, any>) => {
        setFilters(newFilters);
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('¿Estás seguro de eliminar este registro?')) {
            try {
                await deleteRecord.mutateAsync(id);
            } catch (error) {
                console.error('Error al eliminar registro:', error);
                alert('Error al eliminar el registro');
            }
        }
    };

    const handleRowClick = (record: RopaTable) => {
        setSelectedRecord(record);
    };

    const handleEditClick = (record: RopaTable, e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(record);
    };

    const getDetailFields = (record: RopaTable) => [
        { label: 'Actividad de Tratamiento', value: record.processingActivity, fullWidth: true },
        { label: 'Método de Captura', value: record.captureMethod },
        { label: 'Sistema', value: getLookupName(systems, record.systemId) },
        { label: 'Fuente de Datos', value: record.dataSource || '-' },
        { label: 'Tipo de Dato', value: getLookupName(dataTypes, record.dataTypesId) },
        { label: 'Categoría de Dato', value: record.dataCategories || '-' },
        { label: 'Categoría de Titular', value: getLookupName(subjectCategories, record.subjectCategoriesId) },
        { label: 'Finalidad', value: getLookupName(purposes, record.purposesId) },
        { label: 'Descripción Finalidad', value: record.purposeDescription || '-', fullWidth: true },
        { label: 'Almacenamiento', value: getLookupName(storage, record.storageId) },
        { label: 'Dato Compartido', value: record.dataShared || '-' },
        { label: 'Destinatarios', value: getLookupName(dataFlow, record.recipientsId) },
        { label: 'Período de Retención', value: record.retentionPeriod },
        { label: 'Responsable', value: getLookupName(departments, record.processOwner) },
        { label: 'Creado Por', value: record.createdBy || '-' },
        { label: 'Actualizado Por', value: record.updatedBy || '-' },
    ];

    const displayRecords = records || initialRecords;

    if (displayRecords.length === 0) {
        return (
            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-12">
                <TableFilter filters={filterConfig} onFilterChange={handleFilterChange} className="mb-6" />
                <div className="flex flex-col items-center text-center">
                    <Icon icon="mdi:table-off" width="64" height="64" className="text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                        No hay registros de tratamiento
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Crea un nuevo registro usando el botón superior
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
                            Listado de Tratamientos
                        </h2>
                        <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                            {displayRecords.length}
                        </span>
                    </div>
                </div>

                <TableFilter filters={filterConfig} onFilterChange={handleFilterChange} className="mb-4" />

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actividad</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sistema</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categoría</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Compartido</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Responsable</th>
                                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {displayRecords.map((record) => (
                                <tr
                                    key={record.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                                    onClick={() => handleRowClick(record)}
                                >
                                    <td className="py-4 px-4">
                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                            {record.processingActivity}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {getLookupName(systems, record.systemId)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                                            record.dataCategories === 'Sensible'
                                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                                : record.dataCategories === 'Privada'
                                                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                                                    : record.dataCategories === 'Semiprivada'
                                                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                                        : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                        }`}>
                                            {record.dataCategories || '-'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                                            record.dataShared === 'Sí'
                                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                                : record.dataShared === 'No'
                                                    ? 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                                                    : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                        }`}>
                                            {record.dataShared || '-'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {getLookupName(departments, record.processOwner)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                onClick={(e) => handleEditClick(record, e)}
                                                className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Icon icon="mdi:pencil" width="18" height="18" className="text-purple-500" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(record.id, e)}
                                                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                                                title="Eliminar"
                                                disabled={deleteRecord.isPending}
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

            {selectedRecord && (
                <DetailModal
                    isOpen={!!selectedRecord}
                    onClose={() => setSelectedRecord(null)}
                    title={`Tratamiento - ${selectedRecord.processingActivity}`}
                    icon="mdi:table-large"
                    iconColor="text-purple-400"
                    fields={getDetailFields(selectedRecord)}
                />
            )}
        </>
    );
}