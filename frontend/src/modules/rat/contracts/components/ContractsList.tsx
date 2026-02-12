import { useState } from 'react';
import { Icon } from '@iconify/react';
import {
    useContractsFiltered,
    useDeleteContract,
    useContractTypesForFilter,
    useContractStatusesForFilter,
    useEntities
} from '../hooks/useContracts';
import type { RopaContract } from '../types';
import TableFilter, { FilterConfig } from '../../../cumplimiento/TableFilter';
import DetailModal from '../../DetailModal';
import { usePermissions } from '../../../../hooks/usePermissions';

interface ContractsListProps {
    contracts: RopaContract[];
    onEdit: (contract: RopaContract) => void;
}

export default function ContractsList({ contracts: initialContracts, onEdit }: ContractsListProps) {
    const { isSuperAdmin } = usePermissions();
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [selectedContract, setSelectedContract] = useState<RopaContract | null>(null);

    const { data: contracts } = useContractsFiltered(filters);
    const { data: contractTypeOptions } = useContractTypesForFilter();
    const { data: statusOptions } = useContractStatusesForFilter();
    const { data: entities } = useEntities();
    const deleteContract = useDeleteContract();

    // Función para obtener el nombre de la entidad
    const getEntityName = (entityId: number): string => {
        const entity = entities?.find(e => e.id === entityId);
        return entity?.name || entityId.toString();
    };

    // Función para determinar si se pueden mostrar botones de acción
    const canEditContract = (_contract: RopaContract): boolean => {
        if (isSuperAdmin) return true;
        return true;
    };

    // Abrir PDF en nueva pestaña desde base64
    const handleViewPdf = (contract: RopaContract, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!contract.attachment) return;

        try {
            const base64 = contract.attachment;
            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
            setTimeout(() => URL.revokeObjectURL(url), 10000);
        } catch (error) {
            console.error('Error al abrir PDF:', error);
            alert('No se pudo abrir el archivo PDF');
        }
    };

    // Descargar PDF desde base64
    const handleDownloadPdf = (contract: RopaContract, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!contract.attachment) return;

        try {
            const base64 = contract.attachment;
            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = contract.attachmentFileName || `contrato-${contract.contractId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(url), 5000);
        } catch (error) {
            console.error('Error al descargar PDF:', error);
            alert('No se pudo descargar el archivo PDF');
        }
    };

    const filterConfig: FilterConfig[] = [
        {
            key: 'contractType',
            label: 'Tipo de Contrato',
            type: 'select',
            options: contractTypeOptions || [],
        },
        {
            key: 'status',
            label: 'Estado',
            type: 'select',
            options: statusOptions || [],
        },
    ];

    const handleFilterChange = (newFilters: Record<string, any>) => {
        setFilters(newFilters);
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('¿Estás seguro de eliminar este contrato?')) {
            try {
                await deleteContract.mutateAsync(id);
            } catch (error) {
                console.error('Error al eliminar contrato:', error);
                alert('Error al eliminar el contrato');
            }
        }
    };

    const handleRowClick = (contract: RopaContract) => {
        setSelectedContract(contract);
    };

    const handleEditClick = (contract: RopaContract, e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(contract);
    };

    const formatDate = (date: Date | undefined | null) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('es-ES');
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'Vigente':
                return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
            case 'Vencido':
                return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
            case 'En revisión':
                return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
            case 'Cancelado':
                return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
            default:
                return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
        }
    };

    const getDetailFields = (contract: RopaContract) => [
        { label: 'ID Contrato', value: contract.contractId },
        { label: 'Entidad', value: getEntityName(contract.entityId) },
        { label: 'Tipo de Contrato', value: contract.contractType },
        { label: 'Fecha de Inicio', value: formatDate(contract.startDate) },
        { label: 'Fecha de Fin', value: formatDate(contract.endDate) },
        { label: 'Estado', value: contract.status },
        { label: 'Notas', value: contract.notes || '-', fullWidth: true },
        {
            label: 'Adjunto',
            value: contract.attachment ? (
                <div className="flex items-center gap-2">
                    <Icon icon="mdi:file-pdf-box" width="20" height="20" className="text-red-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {contract.attachmentFileName || 'documento.pdf'}
                    </span>
                    <button
                        onClick={(e) => handleViewPdf(contract, e)}
                        className="ml-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    >
                        Ver
                    </button>
                    <button
                        onClick={(e) => handleDownloadPdf(contract, e)}
                        className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                    >
                        Descargar
                    </button>
                </div>
            ) : (
                <span className="text-gray-400 italic">Sin adjunto</span>
            ),
            fullWidth: true
        },
        { label: 'Creado Por', value: contract.createdBy || '-' },
        { label: 'Actualizado Por', value: contract.updatedBy || '-' },
    ];

    const displayContracts = contracts || initialContracts;

    if (displayContracts.length === 0) {
        return (
            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-12">
                <TableFilter filters={filterConfig} onFilterChange={handleFilterChange} className="mb-6" />
                <div className="flex flex-col items-center text-center">
                    <Icon icon="mdi:file-document-outline" width="64" height="64" className="text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                        No hay contratos registrados
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Crea un nuevo contrato usando el botón superior
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
                            Listado de Contratos
                        </h2>
                        <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                            {displayContracts.length}
                        </span>
                    </div>
                </div>

                <TableFilter filters={filterConfig} onFilterChange={handleFilterChange} className="mb-4" />

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID Contrato</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Entidad</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha Inicio</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha Fin</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">PDF</th>
                                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {displayContracts.map((contract) => (
                                <tr
                                    key={contract.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                                    onClick={() => handleRowClick(contract)}
                                >
                                    <td className="py-4 px-4">
                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                            {contract.contractId}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {getEntityName(contract.entityId)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                                            {contract.contractType}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {formatDate(contract.startDate)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {formatDate(contract.endDate)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(contract.status)}`}>
                                            {contract.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        {contract.attachment ? (
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={(e) => handleViewPdf(contract, e)}
                                                    className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                    title="Ver PDF"
                                                >
                                                    <Icon icon="mdi:file-pdf-box" width="20" height="20" className="text-red-500" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDownloadPdf(contract, e)}
                                                    className="p-1.5 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                                    title="Descargar PDF"
                                                >
                                                    <Icon icon="mdi:download" width="18" height="18" className="text-green-500" />
                                                </button>
                                            </div>
                                        ) : (
                                            <Icon icon="mdi:file-remove" width="20" height="20" className="text-gray-400 mx-auto" />
                                        )}
                                    </td>

                                    {canEditContract(contract) && (
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={(e) => handleEditClick(contract, e)}
                                                    className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Icon icon="mdi:pencil" width="18" height="18" className="text-purple-500" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(contract.id, e)}
                                                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Eliminar"
                                                    disabled={deleteContract.isPending}
                                                >
                                                    <Icon icon="mdi:delete" width="18" height="18" className="text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    )}

                                    {!canEditContract(contract) && (
                                        <td className="py-4 px-4">
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedContract && (
                <DetailModal
                    isOpen={!!selectedContract}
                    onClose={() => setSelectedContract(null)}
                    title={`Contrato - ${selectedContract.contractId}`}
                    icon="mdi:file-document-edit"
                    iconColor="text-purple-400"
                    fields={getDetailFields(selectedContract)}
                />
            )}
        </>
    );
}
