import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useUserStore } from '../../../stores/userStore';
import { useState, useEffect } from 'react';
import logo from '../../../assets/logo.png';
import logoName from '../../../assets/korhex-logo-name.png';
import logoi from '../../../assets/logo-i.png';
import logonamei from '../../../assets/korhex-logo-name-i.png';

export default function Sidebar() {
    const { hasAccess, userData } = useUserStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSancionDropdownOpen, setIsSancionDropdownOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Primero verificar localStorage
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
            setIsDarkMode(true);
        } else if (savedTheme === 'light') {
            document.documentElement.classList.remove('dark');
            setIsDarkMode(false);
        } else {
            // Si no hay tema guardado, detectar preferencia del sistema
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                document.documentElement.classList.add('dark');
                setIsDarkMode(true);
            } else {
                document.documentElement.classList.remove('dark');
                setIsDarkMode(false);
            }
        }
        
        // Observer para cambios de tema externos
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    setIsDarkMode(document.documentElement.classList.contains('dark'));
                }
            });
        });
        
        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const menuItems = [
        { path: '/app/dashboard', label: 'Dashboard', access: 'accessDashboard', icon: 'mdi:view-dashboard' },
        { path: '/app/epid', label: 'EPID', access: 'accessEpid', icon: 'mdi:clipboard-text' },
        { path: '/app/rat', label: 'RAT', access: 'accessRat', icon: 'mdi:link-variant' },
        { path: '/app/habeasdata', label: 'Habeas Data', access: 'accessHabeasdata', icon: 'mdi:file-document' },
        { path: '/app/matrizriesgo', label: 'Matriz Riesgo', access: 'accessMatrizriesgo', icon: 'mdi:alert-circle' },
        { path: '/app/ajustes', label: 'Ajustes', access: 'accessAjustes', icon: 'mdi:cog' },
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
        navigate('/app/sancion');
        setIsSancionDropdownOpen(!isSancionDropdownOpen);
    };

    const isSancionActive = location.pathname === '/app/sancion';

    return (
      <nav className="group w-[60px] hover:w-[200px] min-h-[95vh] p-2 m-3 bg-white dark:bg-[#02020248] rounded-xl transition-all duration-300 overflow-hidden flex flex-col">
            
           
            {/* Logo Section */}
            <div className="flex items-center justify-center py-4 px-2">
                {/* Logo pequeño (sidebar cerrado) */}
                <img 
                    src={isDarkMode ? logoi : logo}
                    alt="Logo" 
                    className="w-10 h-10 object-contain group-hover:hidden transition-all duration-300"
                />
                {/* Logo + Nombre (sidebar abierto) */}
                <div className="hidden group-hover:flex items-center gap-2 transition-all duration-300">
                    <img 
                        src={isDarkMode ? logoi : logo}
                        alt="Logo"
                        className="w-8 h-8 object-contain"
                    />
                    <img 
                        src={isDarkMode ? logonamei : logoName}
                        alt="Korhex" 
                        className="h-6 object-contain"
                    />
                </div>
            </div>

           {/* Mi Cuenta - Debajo del logo */}
            {hasAccess('accessUsuario' as any) && (
                <div className="py-2 mb-25">
                    <NavLink
                        to="/app/usuario"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded-[13px] transition-colors text-sm ${
                                isActive
                                    ? 'bg-[#68363625] text-black dark:bg-[#3b82f6] dark:text-white'
                                    : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`
                        }
                    >
                        <Icon icon="mdi:account-circle" width="20" height="20" className="shrink-0 -ml-0.5" />
                        <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
                            <span className="whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                {userData?.fullName || 'Mi Cuenta'}
                            </span>
                            <span className="whitespace-nowrap text-xs text-gray-500 dark:text-gray-400 truncate">
                                {userData?.email || ''}
                            </span>
                        </div>
                        
                    </NavLink>
                </div>
            )}


                <ul className="list-none m-0 space-y-1 flex-1 py-4">
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

                            {/* Sanciones */}
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
                <div className=" pt-60 pb-2 mb-4">
                <button
                    onClick={toggleTheme}
                    className="flex items-center gap-2 w-full px-4 py-2 rounded-[13px] transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    {/* Icono (siempre visible, mismo tamaño) */}
                    <Icon 
                        icon={isDarkMode ? "mdi:moon-waning-crescent" : "mdi:white-balance-sunny"} 
                        width="17" 
                        height="17" 
                        className={`shrink-0 transition-all duration-300 ${isDarkMode ? 'text-blue-400' : 'text-yellow-500'}`}
                    />
                    
                    {/* Texto (solo visible cuando sidebar abierto) */}
                    <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm text-gray-700 dark:text-gray-300">
                        {isDarkMode ? 'Modo Oscuro' : 'Modo Claro'}
                    </span>
                </button>
            </div>

            </ul>
          
        </nav>
    );
}