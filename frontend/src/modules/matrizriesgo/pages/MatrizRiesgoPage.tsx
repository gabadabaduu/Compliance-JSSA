import './MatrizRiesgoPage.css';
import MatrizRiesgoNamesList from '../components/MatrizRiesgoNamesList';

export default function MatrizRiesgoPage() {
    return (
        <div className="page-container">
            <h2>Matriz de Riesgo</h2>
            <div className="content-box">
                <p>Contenido del módulo Matriz de Riesgo</p>

                <div className="matrizriesgo-list-section">
                    <h3>Nombres Matriz Riesgo</h3>
                    <MatrizRiesgoNamesList />
                </div>
            </div>
        </div>
    );
}