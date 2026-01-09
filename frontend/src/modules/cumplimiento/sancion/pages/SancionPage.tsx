import './SancionPage.css';
import SancionNamesList from '../components/SancionNamesList';

export default function SancionPage() {
    return (
        <div className="page-container">
            <h2>Sancion</h2>
            <div className="content-box">
                <p>Contenido del módulo Sancion</p>

                <div className="normograma-list-section">
                    <h3>Nombres Sancion</h3>
                    <SancionNamesList />
                </div>
            </div>
        </div>
    );
}