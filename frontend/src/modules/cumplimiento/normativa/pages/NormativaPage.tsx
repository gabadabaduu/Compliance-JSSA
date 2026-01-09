import './NormativaPage.css';
import NormativaNamesList from '../components/NormativaNamesList';

export default function NormativaPage() {
    return (
        <div className="page-container">
            <h2>Normativa</h2>
            <div className="content-box">
                <p>Contenido del módulo Normativa</p>

                <div className="normograma-list-section">
                    <h3>Nombres Normativa</h3>
                    <NormativaNamesList />
                </div>
            </div>
        </div>
    );
}