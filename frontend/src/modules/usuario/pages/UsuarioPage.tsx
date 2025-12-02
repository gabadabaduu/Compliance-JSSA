import './UsuarioPage.css';
import UsuarioNamesList from '../components/UsuarioNamesList';

export default function UsuarioPage() {
    return (
        <div className="page-container">
            <h2>Usuario</h2>
            <div className="content-box">
                <p>Contenido del módulo Usuario</p>

                <div className="usuario-list-section">
                    <h3>Nombres Usuario</h3>
                    <UsuarioNamesList />
                </div>
            </div>
        </div>
    );
}