import './RATPage.css';
import RatNamesList from '../components/RatNamesList';

export default function RATPage() {
    return (
        <div className="page-container">
            <h2>RAT - Registro de Actividades de Tratamiento</h2>
            <div className="content-box">
                <p>Contenido del módulo RAT</p>

                <div className="epid-list-section">
                    <h3>Nombres RAT</h3>
                    <RatNamesList />
                </div>
            </div>
        </div>
    );
}