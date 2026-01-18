import { NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useUserStore } from '../../../stores/userStore';
import { useState } from 'react';

export default function Sidebar() {
    const { hasAccess } = useUserStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const menuItems = [
        { path: '/app/dashboard', label: 'Dashboard', access: 'accessDashboard', icon: 'mdi:view-dashboard' },
        { path: '/app/epid', label: 'EPID', access: 'accessEpid', icon: 'mdi:clipboard-text' },
        { path: '/app/rat', label: 'RAT', access: 'accessRat', icon: 'mdi:link-variant' },
        { path: '/app/habeasdata', label: 'Habeas Data', access: 'accessHabeasdata', icon: 'mdi:file-document' },
        { path: '/app/matrizriesgo', label: 'Matriz Riesgo', access: 'accessMatrizriesgo', icon: 'mdi:alert-circle' },
        { path: '/app/ajustes', label: 'Ajustes', access: 'accessAjustes', icon: 'mdi:cog' },
        { path: '/app/usuario', label: 'Mi Cuenta', access: 'accessUsuario', icon: 'mdi:account-circle' },
    ];

    const dropdownItems = [
        { path: '/app/normativa', label: 'Normativa', icon: 'mdi:book-open-variant' },
        { path: '/app/sancion', label: 'Sanciones', icon: 'mdi:gavel' },
        { path: '/app/resolucion', label: 'Resoluciones', icon: 'mdi:file-check' },
    ];

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

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

                {/* Dropdown */}
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
                            {dropdownItems.map((item) => (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `flex items-center gap-2 px-4 py-2 rounded-[13px] transition-colors text-sm ${
                                                isActive
                                                    ? 'bg-[#68363625] text-black dark:bg-[#3b82f6] dark:text-white'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`
                                        }
                                    >
                                        <Icon icon={item.icon} width="17" height="17" className="shrink-0" />
                                        <span className="whitespace-nowrap">{item.label}</span>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            </ul>
        </nav>
    );
}