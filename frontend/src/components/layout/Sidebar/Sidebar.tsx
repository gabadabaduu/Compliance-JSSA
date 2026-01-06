// Ejemplo de cómo debería quedar el Sidebar
import { NavLink } from 'react-router-dom'
import { useUserStore } from '../../../stores/userStore'
import './Sidebar.css'

export default function Sidebar() {
    const { hasAccess } = useUserStore()

    const menuItems = [
        { path: '/app/dashboard', label: 'Dashboard', access: 'accessDashboard', icon: '📊' },
        { path: '/app/epid', label: 'EPID', access: 'accessEpid', icon: '📋' },
        { path: '/app/rat', label: 'RAT', access: 'accessRat', icon: '🔗' },
        { path: '/app/habeasdata', label: 'Habeas Data', access: 'accessHabeasdata', icon: '📄' },
        { path: '/app/normograma', label: 'Normograma', access: 'accessNormograma', icon: '📚' },
        { path: '/app/matrizriesgo', label: 'Matriz Riesgo', access: 'accessMatrizriesgo', icon: '⚠️' },
        { path: '/app/ajustes', label: 'Ajustes', access: 'accessAjustes', icon: '⚙️' },
        { path: '/app/usuario', label: 'Mi Cuenta', access: 'accessUsuario', icon: '👤' },
    ]

    return (
        <nav className="sidebar">
            <div className="sidebar-header">
                <h2>Compliance JSSA</h2>
            </div>

            <ul className="sidebar-menu">
                {menuItems.map((item) => (
                    // Solo mostrar si tiene acceso
                    hasAccess(item.access as any) && (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    isActive ? 'sidebar-link active' : 'sidebar-link'
                                }
                            >
                                <span className="sidebar-icon">{item.icon}</span>
                                <span className="sidebar-label">{item.label}</span>
                            </NavLink>
                        </li>
                    )
                ))}
            </ul>
        </nav>
    )
}