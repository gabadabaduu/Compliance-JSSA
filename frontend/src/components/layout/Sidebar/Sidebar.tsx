import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useUserStore } from '../../../stores/userStore';
import { useState, useEffect } from 'react';

export default function Sidebar() {
    const { hasAccess } = useUserStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSancionDropdownOpen, setIsSancionDropdownOpen] = useState(false);

    const menuItems = [
        { path: '/app/dashboard', label: 'Dashboard', access: 'accessDashboard', icon: 'mdi:view-dashboard' },
        { path: '/app/epid', label: 'EPID', access: 'accessEpid', icon: 'mdi:clipboard-text' },
        { path: '/app/rat', label: 'RAT', access: 'accessRat', icon: 'mdi:link-variant' },
        { path: '/app/habeasdata', label: 'Habeas Data', access: 'accessHabeasdata', icon: 'mdi:file-document' },
        { path: '/app/matrizriesgo', label: 'Matriz Riesgo', access: 'accessMatrizriesgo', icon: 'mdi:alert-circle' },
        { path: '/app/ajustes', label: 'Ajustes', access: 'accessAjustes', icon: 'mdi:cog' },
        { path: '/app/usuario', label: 'Mi Cuenta', access: 'accessUsuario', icon: 'mdi:account-circle' },
    ];

    // Abrir dropdowns automáticamente si estamos en una ruta relacionada
    useEffect(() => {
        if (location.pathname.includes('/app/normativa') || 
            location.pathname.includes('/app/sancion') || 
            location.pathname.includes('/app/resolucion')) {
            setIsDropdownOpen(true);
        }
        if (location.pathname.includes('/app/sancion') || 
            location.pathname.includes('/app/resolucion')) {
            setIsSancionDropdownOpen(true);
        }
    }, [location.pathname]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleSancionClick = () => {
        // Navegar a sanciones Y abrir/cerrar el dropdown
        navigate('/app/sancion');
        setIsSancionDropdownOpen(!isSancionDropdownOpen);
    };

    const isSancionActive = location.pathname === '/app/sancion';

    return (
        <nav className="group w-[60px] hover:w-[170px] min-h-[10vh] p-2 pt-[120px] pb-10 m-3 bg-white dark:bg-[#02020248] rounded-xl transition-all duration-300 overflow-hidden">
            <ul className="list-none m-0 space-y-1">
                {menuItems.map((item) => (
                    hasAccess(item.access as any) && (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 px-4 py-2 rounded-[13px] transition-colors text-sm ${
                                        isActive
                                            ? 'bg-[#68363625] text-black dark:bg-[#3b82f6] dark:text-white'
                                            : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`
                                }
                            >
                                <Icon icon={item.icon} width="17" height="17" className="shrink-0" />
                                <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.label}</span>
                            </NavLink>
                        </li>
                    )
                ))}

                {/* Dropdown Cumplimiento */}
                <li>
                    <button
                        className="flex items-center justify-between w-full gap-2 px-4 py-2 rounded-[13px] transition-colors text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={toggleDropdown}
                    >
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:scale-balance" width="17" height="17" className="shrink-0" />
                            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">Cumplimiento</span>
                        </div>
                        <Icon 
                            icon="mdi:chevron-down" 
                            width="17" 
                            height="17"
                            className={`transition-transform opacity-0 group-hover:opacity-100 ${isDropdownOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {isDropdownOpen && (
                        <ul className="mt-2 ml-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {/* Normativa */}
                            <li>
                                <NavLink
                                    to="/app/normativa"
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 px-4 py-2 rounded-[13px] transition-colors text-sm ${
                                            isActive
                                                ? 'bg-[#68363625] text-black dark:bg-[#3b82f6] dark:text-white'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`
                                    }
                                >
                                    <Icon icon="mdi:book-open-variant" width="17" height="17" className="shrink-0" />
                                    <span className="whitespace-nowrap">Normativa</span>
                                </NavLink>
                            </li>

                            {/* Sanciones (navega Y despliega) */}
                            <li>
                                <button
                                    className={`flex items-center justify-between w-full gap-2 px-4 py-2 rounded-[13px] transition-colors text-sm ${
                                        isSancionActive
                                            ? 'bg-[#68363625] text-black dark:bg-[#3b82f6] dark:text-white'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                    onClick={handleSancionClick}
                                >
                                    <div className="flex items-center gap-2">
                                        <Icon icon="mdi:gavel" width="17" height="17" className="shrink-0" />
                                        <span className="whitespace-nowrap">Sanciones</span>
                                    </div>
                                    <Icon 
                                        icon="mdi:chevron-down" 
                                        width="17" 
                                        height="17"
                                        className={`transition-transform ${isSancionDropdownOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {/* Resoluciones (submenú de Sanciones) */}
                                {isSancionDropdownOpen && (
                                    <ul className="ml-4 mt-2 space-y-2">
                                        <li>
                                            <NavLink
                                                to="/app/resolucion"
                                                className={({ isActive }) =>
                                                    `flex items-center gap-2 px-4 py-2 rounded-[13px] transition-colors text-sm ${
                                                        isActive
                                                            ? 'bg-[#68363625] text-black dark:bg-[#3b82f6] dark:text-white'
                                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                    }`
                                                }
                                            >
                                                <Icon icon="mdi:file-check" width="17" height="17" className="shrink-0" />
                                                <span className="whitespace-nowrap">Resoluciones</span>
                                            </NavLink>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        </ul>
                    )}
                </li>
            </ul>
        </nav>
    );
}