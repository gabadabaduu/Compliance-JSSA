import { memo, useMemo } from 'react';
import { Icon } from '@iconify/react';
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup
} from 'react-simple-maps';
import { useStorageCountries } from '../hooks/useDashboard';
import { countryNamesToEnglish } from '../constants/countryMapping';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

function Mapa() {
    const { data: countries, isLoading, isError } = useStorageCountries();

    const highlightedNames = useMemo(() => {
        if (!countries || countries.length === 0) return new Set<string>();
        return countryNamesToEnglish(countries);
    }, [countries]);

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-6 h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Icon icon="mdi:loading" width="32" height="32" className="animate-spin text-blue-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Cargando mapa...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-6 h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Icon icon="mdi:alert-circle" width="32" height="32" className="text-red-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Error al cargar datos del mapa</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Icon icon="mdi:earth" width="22" height="22" className="text-blue-500" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        Almacenamiento Global
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Países donde se almacenan datos
                    </p>
                </div>
                {countries && countries.length > 0 && (
                    <span className="ml-auto px-2.5 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                        {countries.length} {countries.length === 1 ? 'país' : 'países'}
                    </span>
                )}
            </div>

            {/* Mapa */}
            <div className="flex-1 min-h-0 relative">
                {countries && countries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <Icon icon="mdi:map-marker-off" width="48" height="48" className="text-gray-300 dark:text-gray-600 mb-3" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">No hay datos de ubicación registrados</p>
                    </div>
                ) : (
                    <ComposableMap
                        projectionConfig={{
                            rotate: [-10, 0, 0],
                            scale: 180,
                        }}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <ZoomableGroup center={[0, 20]} zoom={1.4}>
                            <Geographies geography={GEO_URL}>
                                {({ geographies }) =>
                                    geographies.map((geo) => {
                                        const countryName = geo.properties?.name || '';
                                        const isHighlighted = highlightedNames.has(countryName);

                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                fill={isHighlighted ? '#2196F3' : '#e2e8f0'}
                                                stroke="#ffffff"
                                                strokeWidth={0.5}
                                                style={{
                                                    default: {
                                                        outline: 'none',
                                                        transition: 'fill 0.2s',
                                                    },
                                                    hover: {
                                                        fill: isHighlighted ? '#7c3aed' : '#cbd5e1',
                                                        outline: 'none',
                                                        cursor: 'pointer',
                                                    },
                                                    pressed: {
                                                        outline: 'none',
                                                    },
                                                }}
                                            />
                                        );
                                    })
                                }
                            </Geographies>
                        </ZoomableGroup>
                    </ComposableMap>
                )}
            </div>

            {/* Leyenda */}
            {countries && countries.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                            <span>Con datos almacenados</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-gray-600"></div>
                            <span>Sin datos</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {countries.map((country) => (
                            <span
                                key={country}
                                className="px-2 py-0.5 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-md"
                            >
                                {country}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default memo(Mapa);