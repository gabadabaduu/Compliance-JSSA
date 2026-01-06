import './NormogramaPage.css';
import NormogramaNamesList from '../components/NormogramaNamesList';

export default function NormogramaPage() {
    return (
        <div className="page-container">
            <h2>Normograma</h2>
            <div className="content-box">
                <p>Contenido del módulo Normograma</p>

                <div className="normograma-list-section">
                    <h3>Nombres Normograma</h3>
                    <NormogramaNamesList />
                </div>
            </div>
        </div>
    );
}