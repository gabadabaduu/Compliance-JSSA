import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

interface SidebarItem {
    name: string;
    path: string;
}

const menuItems: SidebarItem[] = [
    { name: 'Dashboard', path: '/app/dashboard' },
    { name: 'EPID', path: '/app/epid' },
    { name: 'Habeas Data', path: '/app/habeasdata' },
    { name: 'Normograma', path: '/app/normograma' },
    { name: 'RAT', path: '/app/rat' },
    { name: 'Configuración', path: '/app/settings ' }
];

export default function Sidebar() {
    const location = useLocation();

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>Compliance JSSA</h2>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={location.pathname === item.path ? 'active' : ''}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="sidebar-footer">
                <Link
                    to="/app/user"
                    className={location.pathname === '/app/user' ? 'active' : ''}
                >
                    <div className="user-profile">
                        <div className="user-avatar">👤</div>
                        <span>Mi Perfil</span>
                    </div>
                </Link>
            </div>
        </aside>
    );
}