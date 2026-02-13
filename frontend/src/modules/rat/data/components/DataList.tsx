import { useState } from 'react';
import { Icon } from '@iconify/react';
import {
    useDataStoragesFiltered,
    useDeleteDataStorage,
    useProcessingModesForFilter,
    useCountriesForFilter,
    useDepartments
} from '../hooks/useData';
import type { RopaDataStorage } from '../types';
import TableFilter, { FilterConfig } from '../../../cumplimiento/TableFilter';
import DetailModal from '../../DetailModal';
import { usePermissions } from '../../../../hooks/usePermissions';

interface DataListProps {
    dataStorages: RopaDataStorage[];
    onEdit: (dataStorage: RopaDataStorage) => void;
}

export default function DataList({ dataStorages: initialDataStorages, onEdit }: DataListProps) {
    const { isSuperAdmin } = usePermissions();
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [selectedDataStorage, setSelectedDataStorage] = useState<RopaDataStorage | null>(null);

    const { data: dataStorages } = useDataStoragesFiltered(filters);
    const { data: processingModeOptions } = useProcessingModesForFilter();
    const { data: countryOptions } = useCountriesForFilter();
    const { data: departments } = useDepartments();
    const deleteDataStorage = useDeleteDataStorage();

    // Función para obtener el nombre del departamento custodio
    const getCustodianName = (custodianId: number | null): string => {
        if (!custodianId) return '-';
        const dept = departments?.find(d => d.id === custodianId);
        return dept?.departmentName || custodianId.toString();
    };

    // Función para determinar si se pueden mostrar botones de acción
    const canEditDataStorage = (_dataStorage: RopaDataStorage): boolean => {
        if (isSuperAdmin) return true;
        return true;
    };

    const filterConfig: FilterConfig[] = [
        {
            key: 'processingMode',
            label: 'Modo de Procesamiento',
            type: 'select',
            options: processingModeOptions || [],
        },
        {
            key: 'country',
            label: 'País',
            type: 'select',
            options: countryOptions || [],
        },
    ];

    const handleFilterChange = (newFilters: Record<string, any>) => {
        setFilters(newFilters);
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('¿Estás seguro de eliminar este registro de almacenamiento?')) {
            try {
                await deleteDataStorage.mutateAsync(id);
            } catch (error) {
                console.error('Error al eliminar registro:', error);
                alert('Error al eliminar el registro');
            }
        }
    };

    const handleRowClick = (dataStorage: RopaDataStorage) => {
        setSelectedDataStorage(dataStorage);
    };

    const handleEditClick = (dataStorage: RopaDataStorage, e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(dataStorage);
    };

    const formatDate = (date: Date | undefined | null) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('es-ES');
    };

    const formatNumber = (num: number): string => {
        return num.toLocaleString('es-ES');
    };

    const getProcessingModeBadgeClass = (mode: string) => {
        switch (mode) {
            case 'Manual':
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
            case 'Automatizado':
                return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
            case 'Mixto':
                return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
            default:
                return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
        }
    };

    const getDetailFields = (ds: RopaDataStorage) => [
        { label: 'Nombre de BD', value: ds.dbName },
        { label: 'Cantidad de Registros', value: formatNumber(ds.recordCount) },
        { label: 'Fecha de Creación', value: formatDate(ds.creationDate) },
        { label: 'Modo de Procesamiento', value: ds.processingMode || '-' },
        { label: 'Ubicación de BD', value: ds.dbLocation },
        { label: 'País', value: ds.country },
        { label: 'Medidas de Seguridad', value: ds.securityMeasures, fullWidth: true },
        { label: 'Custodio (Departamento)', value: getCustodianName(ds.dbCustodian) },
        { label: 'Creado Por', value: ds.createdBy || '-' },
        { label: 'Actualizado Por', value: ds.updatedBy || '-' },
    ];

    const displayDataStorages = dataStorages || initialDataStorages;

    if (displayDataStorages.length === 0) {
        return (
            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-12">
                <TableFilter filters={filterConfig} onFilterChange={handleFilterChange} className="mb-6" />
                <div className="flex flex-col items-center text-center">
                    <Icon icon="mdi:database-off" width="64" height="64" className="text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                        No hay registros de almacenamiento
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
                            Listado de Almacenamiento de Datos
                        </h2>
                        <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                            {displayDataStorages.length}
                        </span>
                    </div>
                </div>

                <TableFilter filters={filterConfig} onFilterChange={handleFilterChange} className="mb-4" />

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Modo Procesamiento</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cantidad</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">País</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Custodio</th>
                                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {displayDataStorages.map((ds) => (
                                <tr
                                    key={ds.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                                    onClick={() => handleRowClick(ds)}
                                >
                                    <td className="py-4 px-4">
                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                            {ds.dbName}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getProcessingModeBadgeClass(ds.processingMode)}`}>
                                            {ds.processingMode || '-'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {formatNumber(ds.recordCount)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {ds.country}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {getCustodianName(ds.dbCustodian)}
                                        </span>
                                    </td>

                                    {canEditDataStorage(ds) && (
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={(e) => handleEditClick(ds, e)}
                                                    className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Icon icon="mdi:pencil" width="18" height="18" className="text-purple-500" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(ds.id, e)}
                                                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Eliminar"
                                                    disabled={deleteDataStorage.isPending}
                                                >
                                                    <Icon icon="mdi:delete" width="18" height="18" className="text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    )}

                                    {!canEditDataStorage(ds) && (
                                        <td className="py-4 px-4">
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedDataStorage && (
                <DetailModal
                    isOpen={!!selectedDataStorage}
                    onClose={() => setSelectedDataStorage(null)}
                    title={`Almacenamiento - ${selectedDataStorage.dbName}`}
                    icon="mdi:database"
                    iconColor="text-purple-400"
                    fields={getDetailFields(selectedDataStorage)}
                />
            )}
        </>
    );
}