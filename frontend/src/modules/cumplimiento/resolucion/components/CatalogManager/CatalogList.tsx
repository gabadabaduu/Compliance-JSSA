import type { CatalogItem, CatalogType, Infringement, SanctionType } from '../../types';

interface Props {
    items: CatalogItem[];
    onEdit: (item: CatalogItem) => void;
    onDelete: (id: number) => void;
    singularName: string;
    catalogType: CatalogType;  // 🆕
}

export default function CatalogList({ items, onEdit, onDelete, singularName, catalogType }: Props) {
    if (items.length === 0) {
        return <div className="catalog-empty">No hay {singularName}s registrados</div>;
    }

    // 🆕 Renderizado condicional según el tipo
    if (catalogType === 'infringement') {
        return (
            <div className="catalog-list infringement-list">
                <div className="infringement-table-header">
                    <span>Estatuto</span>
                    <span>Artículo</span>
                    <span>Sección</span>
                    <span>Descripción</span>
                    <span>Acciones</span>
                </div>
                {(items as Infringement[]).map((item) => (
                    <div key={item.id} className="infringement-table-row">
                        <span>{item.statute}</span>
                        <span>{item.article}</span>
                        <span>{item.section}</span>
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

    // Renderizado para catálogos simples (name only)
    return (
        <div className="catalog-list">
            {(items as SanctionType[]).map((item) => (
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