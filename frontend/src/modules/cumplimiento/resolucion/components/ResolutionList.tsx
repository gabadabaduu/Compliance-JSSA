import { useDeleteResolution } from '../hooks/useResolution';
import type { Resolution } from '../types';
import './ResolutionList.css';

interface ResolutionListProps {
    resolutions: Resolution[];
    onEdit: (resolution: Resolution) => void;
}

export default function ResolutionList({ resolutions, onEdit }: ResolutionListProps) {
    const deleteResolution = useDeleteResolution();

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar esta resolución?')) {
            try {
                await deleteResolution.mutateAsync(id);
            } catch (error) {
                console.error('Error al eliminar resolución:', error);
                alert('Error al eliminar la resolución');
            }
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('es-ES');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP'
        }).format(amount);
    };

    if (resolutions.length === 0) {
        return (
            <div className="resolution-list-empty">
                <p>No hay resoluciones registradas</p>
                <p className="empty-subtitle">Crea una nueva resolución usando el botón superior</p>
            </div>
        );
    }

    return (
        <div className="resolution-list-container">
            <div className="resolution-table">
                <div className="resolution-table-header">
                    <div className="col-id">ID</div>
                    <div className="col-number">Número</div>
                    <div className="col-sanctions">Sanciones</div>
                    <div className="col-year">Año</div>
                    <div className="col-date">Fecha Emisión</div>
                    <div className="col-amount">Monto</div>
                    <div className="col-outcome">Resultado</div>
                    <div className="col-actions">Acciones</div>
                </div>

                <div className="resolution-table-body">
                    {resolutions.map((resolution) => (
                        <div key={resolution.id} className="resolution-table-row">
                            <div className="col-id">{resolution.id}</div>
                            <div className="col-number">{resolution.number}</div>
                            <div className="col-sanctions" title={resolution.sanctions}>
                                {resolution.sanctions}
                            </div>
                            <div className="col-year">{resolution.year}</div>
                            <div className="col-date">{formatDate(resolution.issueDate)}</div>
                            <div className="col-amount">{formatCurrency(resolution.amount)}</div>
                            <div className="col-outcome">
                                <span className={`outcome-badge outcome-${resolution.outcome.toLowerCase().replace(/\s/g, '-')}`}>
                                    {resolution.outcome}
                                </span>
                            </div>
                            <div className="col-actions">
                                {resolution.url && (
                                    <a
                                        href={resolution.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-icon btn-link"
                                        title="Ver documento"
                                    >
                                        🔗
                                    </a>
                                )}
                                <button
                                    onClick={() => onEdit(resolution)}
                                    className="btn-icon btn-edit"
                                    title="Editar"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleDelete(resolution.id)}
                                    className="btn-icon btn-delete"
                                    title="Eliminar"
                                    disabled={deleteResolution.isPending}
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