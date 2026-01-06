import './EPIDPage.css';
import EpidNamesList from '../components/EpidNamesList';

export default function EPIDPage() {
    return (
        <div className="page-container">
            <h2>EPID</h2>
            <div className="content-box">
                <p>Contenido del módulo EPID</p>

                <div className="epid-list-section">
                    <h3>Nombres EPID</h3>
                    <EpidNamesList />
                </div>
            </div>
        </div>
    );
}