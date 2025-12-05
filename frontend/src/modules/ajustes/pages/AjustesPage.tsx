import './AjustesPage.css';
import AjustesNamesList from '../components/AjustesNamesList';

export default function AjustesPage() {
    return (
        <div className="page-container">
            <h2>Ajustes</h2>
            <div className="content-box">
                <p>Contenido del módulo Ajustes</p>

                <div className="ajustes-list-section">
                    <h3>Nombres Ajustes</h3>
                    <AjustesNamesList />
                </div>
            </div>
        </div>
    );
}