import { useState } from 'react';
import { Icon } from '@iconify/react';
import DataHeader from '../components/DataHeader';
import DataList from '../components/DataList';
import DataForm from '../components/DataForm';
import { useDataStorages } from '../hooks/useData';
import type { RopaDataStorage } from '../types';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

export default function DataPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedDataStorage, setSelectedDataStorage] = useState<RopaDataStorage | null>(null);
    const { data: dataStorages, isLoading, error } = useDataStorages();

    const handleCreate = () => {
        setSelectedDataStorage(null);
        setIsFormOpen(true);
    };

    const handleEdit = (dataStorage: RopaDataStorage) => {
        setSelectedDataStorage(dataStorage);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedDataStorage(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <LoadingSpinner size="large" text="Cargando almacenamiento de datos..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-center gap-3">
                    <Icon icon="mdi:alert-circle" width="24" height="24" className="text-red-500" />
                    <span className="text-red-700 dark:text-red-400">
                        Error al cargar datos: {error.message}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full p-6 space-y-6">
            {/* Sección principal */}
            <div className="space-y-6">
                <DataHeader onCreateClick={handleCreate} />
                <DataList dataStorages={dataStorages || []} onEdit={handleEdit} />
            </div>

            {/* Modal del formulario */}
            {isFormOpen && (
                <DataForm dataStorage={selectedDataStorage} onClose={handleCloseForm} />
            )}
        </div>
    );
}