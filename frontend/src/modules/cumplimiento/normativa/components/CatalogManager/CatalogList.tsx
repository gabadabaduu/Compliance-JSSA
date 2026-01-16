import type { CatalogItem } from '../../types';

interface Props {
    items: CatalogItem[];
    onEdit: (item: CatalogItem) => void;
    onDelete: (id: number) => void;
    singularName: string;
}

export default function CatalogList({ items, onEdit, onDelete, singularName }: Props) {
    if (items.length === 0) {
        return <div className="catalog-empty">No hay {singularName}s registrados</div>;
    }

    return (
        <div className="catalog-list">
            {items.map((item) => (
                <div key={item.id} className="catalog-item">
                    <span className="catalog-item-name">{item.name}</span>
                    <div className="catalog-item-actions">
                        <button
                            className="btn-edit"
                            onClick={() => onEdit(item)}
                            title="Editar"
                        >
                            ✏️
                        </button>
                        <button
                            className="btn-delete"
                            onClick={() => onDelete(item.id)}
                            title="Eliminar"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}