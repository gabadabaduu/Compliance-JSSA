import { useDeleteRegulation } from '../hooks/useNormativa';
import type { Regulation } from '../types';
import './NormativaList.css';

interface NormativaListProps {
    regulations: Regulation[];
    onEdit: (regulation: Regulation) => void;
}

export default function NormativaList({ regulations, onEdit }: NormativaListProps) {
    const deleteRegulation = useDeleteRegulation();

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar esta normativa?')) {
            try {
                await deleteRegulation.mutateAsync(id);
            } catch (error) {
                console.error('Error al eliminar normativa:', error);
                alert('Error al eliminar la normativa');
            }
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('es-ES');
    };

    if (regulations.length === 0) {
        return (
            <div className="normativa-list-empty">
                <p>No hay normativas registradas</p>
                <p className="empty-subtitle">Crea una nueva normativa usando el botón superior</p>
            </div>
        );
    }

    return (
        <div className="normativa-list-container">
            <div className="normativa-table">
                <div className="normativa-table-header">
                    <div className="col-id">ID</div>
                    <div className="col-number">Número</div>
                    <div className="col-title">Título</div>
                    <div className="col-common-name">Nombre Común</div>
                    <div className="col-year">Año</div>
                    <div className="col-date">Fecha Emisión</div>
                    <div className="col-status">Estado</div>
                    <div className="col-actions">Acciones</div>
                </div>

                <div className="normativa-table-body">
                    {regulations.map((regulation) => (
                        <div key={regulation.id} className="normativa-table-row">
                            <div className="col-id">{regulation.id}</div>
                            <div className="col-number">{regulation.number}</div>
                            <div className="col-title" title={regulation.title}>
                                {regulation.title}
                            </div>
                            <div className="col-common-name" title={regulation.commonName}>
                                {regulation.commonName}
                            </div>
                            <div className="col-year">{regulation.year}</div>
                            <div className="col-date">{formatDate(regulation.issueDate)}</div>
                            <div className="col-status">
                                <span className={`status-badge status-${regulation.status.toLowerCase()}`}>
                                    {regulation.status}
                                </span>
                            </div>
                            <div className="col-actions">
                                {regulation.url && (
                                    <a
                                        href={regulation.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-icon btn-link"
                                        title="Ver documento"
                                    >
                                        🔗
                                    </a>
                                )}
                                <button
                                    onClick={() => onEdit(regulation)}
                                    className="btn-icon btn-edit"
                                    title="Editar"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleDelete(regulation.id)}
                                    className="btn-icon btn-delete"
                                    title="Eliminar"
                                    disabled={deleteRegulation.isPending}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}