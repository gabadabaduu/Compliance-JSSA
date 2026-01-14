import './NormativaHeader.css';

interface NormativaHeaderProps {
    onCreateClick: () => void;
}

export default function NormativaHeader({ onCreateClick }: NormativaHeaderProps) {
    return (
        <div className="normativa-header">
            <div className="normativa-header-content">
                <h1>📖 Normativa</h1>
                <p className="normativa-subtitle">Gestión de Regulaciones y Normativas Aplicables</p>
            </div>
            <button
                className="btn-create-normativa"
                onClick={onCreateClick}
            >
                <span className="icon">+</span>
                Nueva Normativa
            </button>
        </div>
    );
}