import type { CatalogItem, CatalogType, Entity, Industry } from '../../types';

interface Props {
    items: CatalogItem[];
    onEdit: (item: CatalogItem) => void;
    onDelete: (id: number) => void;
    singularName: string;
    catalogType: CatalogType;
}

export default function CatalogList({ items, onEdit, onDelete, singularName, catalogType }: Props) {
    if (items.length === 0) {
        return <div className="catalog-empty">No hay {singularName}s registrados</div>;
    }

    // 🆕 Renderizado para Entity (tipo complejo)
    if (catalogType === 'entity') {
        return (
            <div className="catalog-list entity-list">
                <div className="entity-table-header">
                    <span>Nombre</span>
                    <span>Industria</span>
                    <span>Descripción</span>
                    <span>Acciones</span>
                </div>
                {(items as Entity[]).map((item) => (
                    <div key={item.id} className="entity-table-row">
                        <span>{item.name}</span>
                        <span>{item.industry}</span>
                        <span title={item.description}>
                            {item.description.length > 50
                                ? item.description.substring(0, 50) + '...'
                                : item.description}
                        </span>
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

    // Renderizado para catálogos simples (Industry)
    return (
        <div className="catalog-list">
            {(items as Industry[]).map((item) => (
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