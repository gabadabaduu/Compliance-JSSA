import './SancionHeader.css';

interface SancionHeaderProps {
    onCreateClick: () => void;
}

export default function SancionHeader({ onCreateClick }: SancionHeaderProps) {
    return (
        <div className="sancion-header">
            <div className="sancion-header-content">
                <h1>⚖️ Sanciones</h1>
                <p className="sancion-subtitle">Gestión de Sanciones y Procesos Administrativos</p>
            </div>
            <button
                className="btn-create-sancion"
                onClick={onCreateClick}
            >
                <span className="icon">+</span>
                Nueva Sanción
            </button>
        </div>
    );
}