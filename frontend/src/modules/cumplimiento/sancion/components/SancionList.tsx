import { useSanctions, useDeleteSanction } from '../hooks/useSancion';
import { getStatusColor, getStageColor, SANCTION_STATUS_LABELS, SANCTION_STAGE_LABELS } from '../types';
import type { Sanction } from '../types';
import './SancionList.css';

interface Props {
    onEdit: (sanction: Sanction) => void;
    onCreate: () => void;
}

export default function SancionList({ onEdit, onCreate }: Props) {
    const { data: sanctions, isLoading, error } = useSanctions();
    const deleteSanction = useDeleteSanction();

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de eliminar esta sanción?')) return;

        try {
            await deleteSanction.mutateAsync(id);
        } catch (err) {
            console.error('Error al eliminar:', err);
            alert('Error al eliminar la sanción');
        }
    };

    if (isLoading) return <div className="loading">Cargando sanciones...</div>;
    if (error) return <div className="error">Error al cargar sanciones: {error.message}</div>;

    if (!sanctions || sanctions.length === 0) {
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
                                <span className={`stage-badge stage-${getStageColor(sanction.stage)}`}>
                                    {SANCTION_STAGE_LABELS[sanction.stage]}
                                </span>
                            </div>
                            <div className="col-status">
                                <span className={`status-badge status-${getStatusColor(sanction.status)}`}>
                                    {SANCTION_STATUS_LABELS[sanction.status]}
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