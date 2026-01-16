import './ResolutionHeader.css';

interface ResolutionHeaderProps {
    onCreateClick: () => void;
}

export default function ResolutionHeader({ onCreateClick }: ResolutionHeaderProps) {
    return (
        <div className="resolution-header">
            <div className="resolution-header-content">
                <h1>⚖️ Resoluciones</h1>
                <p className="resolution-subtitle">Gestión de Resoluciones y Sanciones</p>
            </div>
            <button
                className="btn-create-resolution"
                onClick={onCreateClick}
            >
                <span className="icon">+</span>
                Nueva Resolución
            </button>
        </div>
    );
}