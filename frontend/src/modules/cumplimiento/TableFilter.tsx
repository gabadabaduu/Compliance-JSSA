import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

export interface FilterConfig {
    key: string;
    label: string;
    type: 'select' | 'multiselect' | 'date' | 'text' | 'daterange';
    options?: Array<{ value: string | number; label: string }>;
    fetchOptions?: () => Promise<Array<{ value: string | number; label: string }>>;
    placeholder?: string;
}

interface TableFilterProps {
    filters: FilterConfig[];
    onFilterChange: (filters: Record<string, any>) => void;
    className?: string;
}

export default function TableFilter({ filters, onFilterChange, className = '' }: TableFilterProps) {
    const [filterValues, setFilterValues] = useState<Record<string, any>>({});
    const [dynamicOptions, setDynamicOptions] = useState<Record<string, Array<{ value: string | number; label: string }>>>({});
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Cargar opciones dinámicas
    useEffect(() => {
        const loadDynamicOptions = async () => {
            const optionsMap: Record<string, Array<{ value: string | number; label: string }>> = {};
            for (const filter of filters) {
                if (filter.fetchOptions) {
                    try {
                        const options = await filter.fetchOptions();
                        optionsMap[filter.key] = options;
                    } catch (error) {
                        console.error(`Error loading options for ${filter.key}:`, error);
                        optionsMap[filter.key] = [];
                    }
                }
            }
            setDynamicOptions(optionsMap);
        };
        loadDynamicOptions();
    }, [filters]);

    const handleFilterChange = (key: string, value: any) => {
        const newFilters = { ...filterValues, [key]: value };
        if (!value || (Array.isArray(value) && value.length === 0)) {
            delete newFilters[key];
        }
        setFilterValues(newFilters);
        onFilterChange(newFilters); // Aplicar inmediatamente
    };

    const clearFilter = (key: string) => {
        const newFilters = { ...filterValues };
        delete newFilters[key];
        // También limpiar daterange
        delete newFilters[`${key}_desde`];
        delete newFilters[`${key}_hasta`];
        setFilterValues(newFilters);
        onFilterChange(newFilters);
    };

    const clearAllFilters = () => {
        setFilterValues({});
        onFilterChange({});
    };

    const getFilterDisplayValue = (filter: FilterConfig): string => {
        const value = filterValues[filter.key];
        if (!value && filter.type !== 'daterange') return '';
        
        if (filter.type === 'select' || filter.type === 'multiselect') {
            const options = filter.options || dynamicOptions[filter.key] || [];
            const selected = options.find(opt => opt.value.toString() === value?.toString());
            return selected?.label || '';
        }
        if (filter.type === 'daterange') {
            const desde = filterValues[`${filter.key}_desde`];
            const hasta = filterValues[`${filter.key}_hasta`];
            if (desde && hasta) return `${desde} - ${hasta}`;
            if (desde) return `Desde ${desde}`;
            if (hasta) return `Hasta ${hasta}`;
            return '';
        }
        return value || '';
    };

    const hasActiveFilters = Object.keys(filterValues).length > 0;

    const renderFilterDropdown = (filter: FilterConfig) => {
        const options = filter.options || dynamicOptions[filter.key] || [];
        const isOpen = openDropdown === filter.key;

        switch (filter.type) {
            case 'select':
                return (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                        <div
                            className="px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                            onClick={() => { handleFilterChange(filter.key, ''); setOpenDropdown(null); }}
                        >
                            Todos
                        </div>
                        {options.map((option) => (
                            <div
                                key={option.value}
                                className={`px-3 py-1.5 text-xs cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                    filterValues[filter.key]?.toString() === option.value.toString()
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                        : 'text-gray-700 dark:text-gray-300'
                                }`}
                                onClick={() => { handleFilterChange(filter.key, option.value); setOpenDropdown(null); }}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                );

            case 'text':
                return (
                    <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50 p-2">
                        <input
                            type="text"
                            value={filterValues[filter.key] || ''}
                            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                            placeholder={filter.placeholder || 'Buscar...'}
                            className="w-40 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                );

            case 'date':
                return (
                    <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50 p-2">
                        <input
                            type="date"
                            value={filterValues[filter.key] || ''}
                            onChange={(e) => { handleFilterChange(filter.key, e.target.value); setOpenDropdown(null); }}
                            className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                );

            case 'daterange':
                return (
                    <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50 p-2">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-500 dark:text-gray-400">Desde</label>
                            <input
                                type="date"
                                value={filterValues[`${filter.key}_desde`] || ''}
                                onChange={(e) => handleFilterChange(`${filter.key}_desde`, e.target.value)}
                                className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <label className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Hasta</label>
                            <input
                                type="date"
                                value={filterValues[`${filter.key}_hasta`] || ''}
                                onChange={(e) => handleFilterChange(`${filter.key}_hasta`, e.target.value)}
                                className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div ref={containerRef} className={`flex items-center gap-1 flex-wrap ${className}`}>
            {/* Icono de filtro */}
            <div className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                <Icon icon="mdi:filter-variant" width="14" height="14" />
            </div>

            {/* Filtros individuales */}
            {filters.map((filter) => {
                const displayValue = getFilterDisplayValue(filter);
                const isActive = filter.type === 'daterange' 
                    ? !!(filterValues[`${filter.key}_desde`] || filterValues[`${filter.key}_hasta`])
                    : !!filterValues[filter.key];
                const isOpen = openDropdown === filter.key;

                return (
                    <div key={filter.key} className="relative">
                        <button
                            onClick={() => setOpenDropdown(isOpen ? null : filter.key)}
                            className={`flex items-center gap-1 px-2 py-1 text-xs rounded border transition-colors ${
                                isActive
                                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300'
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                        >
                            <span className="max-w-[100px] truncate">
                                {displayValue || filter.label}
                            </span>
                            <Icon 
                                icon="mdi:chevron-down" 
                                width="12" 
                                height="12" 
                                className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {/* Botón para limpiar filtro activo */}
                        {isActive && (
                            <button
                                onClick={(e) => { e.stopPropagation(); clearFilter(filter.key); }}
                                className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gray-400 dark:bg-gray-500 rounded-full flex items-center justify-center hover:bg-gray-500 dark:hover:bg-gray-400"
                            >
                                <Icon icon="mdi:close" width="10" height="10" className="text-white" />
                            </button>
                        )}

                        {/* Dropdown */}
                        {isOpen && renderFilterDropdown(filter)}
                    </div>
                );
            })}

            {/* Limpiar todos */}
            {hasActiveFilters && (
                <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                >
                    <Icon icon="mdi:filter-remove" width="12" height="12" />
                    Limpiar
                </button>
            )}
        </div>
    );
}