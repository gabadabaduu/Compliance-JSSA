import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../../stores/authStore'
import './LogoutSection.css'

export default function LogoutSection() {
    const navigate = useNavigate()
    const { user, logout } = useAuthStore()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <div className="logout-section">
            <div className="logout-header">
                <h2>Sesión</h2>
                <p>Conectado como: <strong>{user?.email}</strong></p>
            </div>

            <button className="btn-logout" onClick={handleLogout}>
                Cerrar Sesión
            </button>
        </div>
    )
}