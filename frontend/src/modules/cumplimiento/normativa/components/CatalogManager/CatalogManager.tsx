import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useCatalog } from '../../hooks/useCatalog';
import type { CatalogConfig, CatalogItem } from '../../types';
import CatalogHeader from './CatalogHeader';
import CatalogList from './CatalogList';
import CatalogForm from './CatalogForm';
import LoadingSpinner from '../../../../../components/LoadingSpinner/LoadingSpinner';

interface Props {
    config: CatalogConfig;
}

export default function CatalogManager({ config }: Props) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);

    const {
        data,
        isPending,
        isError,
        error,
        create,
        update,
        remove,
        isCreating,
    } = useCatalog(config.endpoint);

    const handleAdd = () => {
        setEditingItem(null);
        setIsFormOpen(true);
    };

    const handleEdit = (item: CatalogItem) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm(`¿Eliminar este ${config.singularName}?`)) {
            remove(id);
        }
    };

    const handleSubmit = (data: Omit<CatalogItem, 'id'>) => {
        if (editingItem) {
            update({ id: editingItem.id, data });
        } else {
            create(data);
        }
        setIsFormOpen(false);
    };

    if (isPending) {
        return (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 flex items-center justify-center">
                <LoadingSpinner size="small" text={`Cargando ${config.pluralName}...`} />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-2">
                <Icon icon="mdi:alert-circle" width="20" height="20" className="text-red-500" />
                <span className="text-sm text-red-700 dark:text-red-400">Error: {error?.message}</span>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <CatalogHeader
                title={config.title}
                onAdd={handleAdd}
                count={data.length}
            />

            <CatalogList
                items={data}
                onEdit={handleEdit}
                onDelete={handleDelete}
                singularName={config.singularName}
            />

            {isFormOpen && (
                <CatalogForm
                    title={editingItem ? `Editar ${config.singularName}` : `Nuevo ${config.singularName}`}
                    initialData={editingItem}
                    onSubmit={handleSubmit}
                    onClose={() => setIsFormOpen(false)}
                    isLoading={isCreating}
                />
            )}
        </div>
    );
}