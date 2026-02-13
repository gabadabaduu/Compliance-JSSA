import { useState } from 'react';
import { Icon } from '@iconify/react';
import EntitiesHeader from '../components/EntitiesHeader';
import EntitiesList from '../components/EntitiesList';
import EntitiesForm from '../components/EntitiesForm';
import { useEntities } from '../hooks/useEntities';
import type { RopaEntity } from '../types';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

export default function EntitiesPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedEntity, setSelectedEntity] = useState<RopaEntity | null>(null);
    const { data: entities, isLoading, error } = useEntities();

    const handleCreate = () => {
        setSelectedEntity(null);
        setIsFormOpen(true);
    };

    const handleEdit = (entity: RopaEntity) => {
        setSelectedEntity(entity);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedEntity(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <LoadingSpinner size="large" text="Cargando entidades..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-center gap-3">
                    <Icon icon="mdi:alert-circle" width="24" height="24" className="text-red-500" />
                    <span className="text-red-700 dark:text-red-400">
                        Error al cargar entidades: {error.message}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full p-6 space-y-6">
            {/* Sección principal */}
            <div className="space-y-6">
                <EntitiesHeader onCreateClick={handleCreate} />
                <EntitiesList entities={entities || []} onEdit={handleEdit} />
            </div>

            {/* Modal del formulario */}
            {isFormOpen && (
                <EntitiesForm entity={selectedEntity} onClose={handleCloseForm} />
            )}
        </div>
    );
}