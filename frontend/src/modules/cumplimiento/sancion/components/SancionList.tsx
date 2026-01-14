import { useDeleteSanction } from '../hooks/useSancion';
import type { Sanction } from '../types';
import './SancionList.css';

interface SancionListProps {
    sanctions: Sanction[];
    onEdit: (sanction: Sanction) => void;
}

export default function SancionList({ sanctions, onEdit }: SancionListProps) {
    const deleteSanction = useDeleteSanction();

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar esta sanción?')) {
            try {
                await deleteSanction.mutateAsync(id);
            } catch (error) {
                console.error('Error al eliminar sanción:', error);
                alert('Error al eliminar la sanción');
            }
        }
    };

    if (sanctions.length === 0) {
        return (
            <div className="sancion-list-empty">
                <p>No hay sanciones registradas</p>
                <p className="empty-subtitle">Crea una nueva sanción usando el botón superior</p>
            </div>
        );
    }

    return (
        <div className="sancion-list-container">
            <div className="sancion-table">
                <div className="sancion-table-header">
                    <div className="col-id">ID</div>
                    <div className="col-number">Número</div>
                    <div className="col-entity">Entidad</div>
                    <div className="col-facts">Hechos</div>
                    <div className="col-stage">Etapa</div>
                    <div className="col-status">Estado</div>
                    <div className="col-actions">Acciones</div>
                </div>

                <div className="sancion-table-body">
                    {sanctions.map((sanction) => (
                        <div key={sanction.id} className="sancion-table-row">
                            <div className="col-id">{sanction.id}</div>
                            <div className="col-number">{sanction.number}</div>
                            <div className="col-entity">{sanction.entity}</div>
                            <div className="col-facts" title={sanction.facts}>
                                {sanction.facts.length > 50
                                    ? `${sanction.facts.substring(0, 50)}...`
                                    : sanction.facts
                                }
                            </div>
                            <div className="col-stage">
                                <span className={`stage-badge stage-${sanction.stage.replace(/\s+/g, '-').toLowerCase()}`}>
                                    {sanction.stage}
                                </span>
                            </div>
                            <div className="col-status">
                                <span className={`status-badge status-${sanction.status.replace(/\s+/g, '-').toLowerCase()}`}>
                                    {sanction.status}
                                </span>
                            </div>
                            <div className="col-actions">
                                <button
                                    onClick={() => onEdit(sanction)}
                                    className="btn-icon btn-edit"
                                    title="Editar"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleDelete(sanction.id)}
                                    className="btn-icon btn-delete"
                                    title="Eliminar"
                                    disabled={deleteSanction.isPending}
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