interface Props {
    title: string;
    count: number;
    onAdd: () => void;
}

export default function CatalogHeader({ title, count, onAdd }: Props) {
    return (
        <div className="catalog-header">
            <div className="catalog-header-info">
                <h3>{title}</h3>
                <span className="catalog-count">{count} registros</span>
            </div>
            <button className="btn-add" onClick={onAdd}>
                + Agregar
            </button>
        </div>
    );
}