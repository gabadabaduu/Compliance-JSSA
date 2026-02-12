import { useState } from 'react';
import { Icon } from '@iconify/react';
import {
    useEntitiesFiltered,
    useDeleteEntity,
    useCountriesForFilter,
    useContactChannels
} from '../hooks/useEntities';
import type { RopaEntity } from '../types';
import TableFilter, { FilterConfig } from '../../../cumplimiento/TableFilter';
import DetailModal from '../..//DetailModal';
import { usePermissions } from '../../../../hooks/usePermissions';

interface EntitiesListProps {
    entities: RopaEntity[];
    onEdit: (entity: RopaEntity) => void;
}

export default function EntitiesList({ entities: initialEntities, onEdit }: EntitiesListProps) {
    const { isSuperAdmin } = usePermissions();
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [selectedEntity, setSelectedEntity] = useState<RopaEntity | null>(null);

    const { data: entities } = useEntitiesFiltered(filters);
    const { data: countryOptions } = useCountriesForFilter();
    const { data: contactChannels } = useContactChannels();
    const deleteEntity = useDeleteEntity();

    // Función para obtener el nombre del canal de contacto
    const getChannelName = (channelId: number | null | undefined): string => {
        if (!channelId) return '-';
        const channel = contactChannels?.find(c => c.id === channelId);
        return channel?.channelName || channelId.toString();
    };

    // Función para determinar si se pueden mostrar botones de acción
    const canEditEntity = (_entity: RopaEntity): boolean => {
        if (isSuperAdmin) return true;
        return true;
    };

    const filterConfig: FilterConfig[] = [
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
        if (window.confirm('¿Estás seguro de eliminar esta entidad? Se eliminarán también los contratos asociados.')) {
            try {
                await deleteEntity.mutateAsync(id);
            } catch (error) {
                console.error('Error al eliminar entidad:', error);
                alert('Error al eliminar la entidad');
            }
        }
    };

    const handleRowClick = (entity: RopaEntity) => {
        setSelectedEntity(entity);
    };

    const handleEditClick = (entity: RopaEntity, e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(entity);
    };

    const getDetailFields = (entity: RopaEntity) => [
        { label: 'Nombre', value: entity.name },
        { label: 'NIT / Tax ID', value: entity.taxId },
        { label: 'Tipo', value: entity.type },
        { label: 'Naturaleza', value: entity.nature },
        { label: 'Dirección', value: entity.address, fullWidth: true },
        { label: 'País', value: entity.country || '-' },
        { label: 'Departamento / Estado', value: entity.state || '-' },
        { label: 'Ciudad', value: entity.city || '-' },
        { label: 'Teléfono Fijo', value: entity.landlineNumber || '-' },
        { label: 'Teléfono Móvil', value: entity.mobileNumber || '-' },
        { label: 'Email', value: entity.email || '-' },
        {
            label: 'Sitio Web',
            value: entity.website ? (
                <a href={entity.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1">
                    <Icon icon="mdi:link-variant" width="16" height="16" />{entity.website}
                </a>
            ) : '-',
        },
        { label: 'Descripción de Servicios', value: entity.serviceDescription || '-', fullWidth: true },
        { label: 'Canal de Contacto', value: getChannelName(entity.contactChannelsId) },
        {
            label: 'Política de Privacidad (Adjunto)',
            value: entity.privacyPolicyAttachment ? (
                <a href={entity.privacyPolicyAttachment} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1">
                    <Icon icon="mdi:file-document" width="16" height="16" />Ver documento
                </a>
            ) : '-',
        },
        {
            label: 'Política de Privacidad (URL)',
            value: entity.privacyPolicyUrl ? (
                <a href={entity.privacyPolicyUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1">
                    <Icon icon="mdi:link-variant" width="16" height="16" />Ver política
                </a>
            ) : '-',
        },
        { label: 'Creado Por', value: entity.createdBy || '-' },
        { label: 'Actualizado Por', value: entity.updatedBy || '-' },
    ];

    const displayEntities = entities || initialEntities;

    if (displayEntities.length === 0) {
        return (
            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-12">
                <TableFilter filters={filterConfig} onFilterChange={handleFilterChange} className="mb-6" />
                <div className="flex flex-col items-center text-center">
                    <Icon icon="mdi:domain-off" width="64" height="64" className="text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                        No hay entidades registradas
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Crea una nueva entidad usando el botón superior
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
                            Listado de Entidades
                        </h2>
                        <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                            {displayEntities.length}
                        </span>
                    </div>
                </div>

                <TableFilter filters={filterConfig} onFilterChange={handleFilterChange} className="mb-4" />

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tax ID</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">País</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descripción de Servicios</th>
                                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {displayEntities.map((entity) => (
                                <tr
                                    key={entity.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                                    onClick={() => handleRowClick(entity)}
                                >
                                    <td className="py-4 px-4">
                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                            {entity.name}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {entity.taxId}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {entity.country || '-'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                            {entity.serviceDescription || '-'}
                                        </span>
                                    </td>

                                    {canEditEntity(entity) && (
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={(e) => handleEditClick(entity, e)}
                                                    className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Icon icon="mdi:pencil" width="18" height="18" className="text-purple-500" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(entity.id, e)}
                                                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Eliminar"
                                                    disabled={deleteEntity.isPending}
                                                >
                                                    <Icon icon="mdi:delete" width="18" height="18" className="text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    )}

                                    {!canEditEntity(entity) && (
                                        <td className="py-4 px-4">
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedEntity && (
                <DetailModal
                    isOpen={!!selectedEntity}
                    onClose={() => setSelectedEntity(null)}
                    title={`Entidad - ${selectedEntity.name}`}
                    icon="mdi:domain"
                    iconColor="text-purple-400"
                    fields={getDetailFields(selectedEntity)}
                />
            )}
        </>
    );
}