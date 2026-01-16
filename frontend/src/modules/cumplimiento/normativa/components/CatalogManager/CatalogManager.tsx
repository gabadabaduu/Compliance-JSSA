import { useState } from 'react';
import { useCatalog } from '../../hooks/useCatalog';
import type { CatalogConfig, CatalogItem } from '../../types';
import CatalogHeader from './CatalogHeader';
import CatalogList from './CatalogList';
import CatalogForm from './CatalogForm';
import './CatalogManager.css';

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
        return <div className="catalog-loading">Cargando {config.pluralName}...</div>;
    }

    if (isError) {
        return (
            <div className="catalog-error">
                Error: {error?.message}
            </div>
        );
    }

    return (
        <div className="catalog-manager">
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