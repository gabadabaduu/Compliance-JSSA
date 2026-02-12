import { useState } from 'react';
import { Icon } from '@iconify/react';
import ContractsHeader from '../components/ContractsHeader';
import ContractsList from '../components/ContractsList';
import ContractsForm from '../components/ContractsForm';
import { useContracts } from '../hooks/useContracts';
import type { RopaContract } from '../types';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

export default function ContractsPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState<RopaContract | null>(null);
    const { data: contracts, isLoading, error } = useContracts();

    const handleCreate = () => {
        setSelectedContract(null);
        setIsFormOpen(true);
    };

    const handleEdit = (contract: RopaContract) => {
        setSelectedContract(contract);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedContract(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <LoadingSpinner size="large" text="Cargando contratos..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-center gap-3">
                    <Icon icon="mdi:alert-circle" width="24" height="24" className="text-red-500" />
                    <span className="text-red-700 dark:text-red-400">
                        Error al cargar contratos: {error.message}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full p-6 space-y-6">
            {/* Sección principal */}
            <div className="space-y-6">
                <ContractsHeader onCreateClick={handleCreate} />
                <ContractsList contracts={contracts || []} onEdit={handleEdit} />
            </div>

            {/* Modal del formulario */}
            {isFormOpen && (
                <ContractsForm contract={selectedContract} onClose={handleCloseForm} />
            )}
        </div>
    );
}