import './HabeasDataPage.css';
import HabeasDataNamesList from '../components/HabeasDataNamesList';

export default function HabeasDataPage() {
    return (
        <div className="page-container">
            <h2>Habeas Data</h2>
            <div className="content-box">
                <p>Contenido del módulo Habeas Data</p>

                <div className="habeasdata-list-section">
                    <h3>Nombres Habeas Data</h3>
                    <HabeasDataNamesList />
                </div>
            </div>
        </div>
    );
}