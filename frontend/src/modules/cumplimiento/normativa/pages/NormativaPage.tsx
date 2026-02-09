import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useRegulations } from '../hooks/useNormativa';
import { usePermissions } from '../../../../hooks/usePermissions';
import NormativaHeader from '../components/NormativaHeader';
import NormativaList from '../components/NormativaList';
import NormativaForm from '../components/NormativaForm';
import CatalogManager from '../components/CatalogManager/CatalogManager';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import type { Regulation } from '../types';
import type { CatalogConfig } from '../types';

// ✅ CORREGIDO: Configuraciones completas de catálogos
const CATALOG_CONFIGS: CatalogConfig[] = [
    {
        endpoint: 'types',
        title: 'Tipos',
        singularName: 'tipo',
        pluralName: 'tipos'
    },
    {
        endpoint: 'authorities',
        title: 'Autoridades',
        singularName: 'autoridad',
        pluralName: 'autoridades'
    },
    {
        endpoint: 'industries',
        title: 'Sectores',
        singularName: 'sector',
        pluralName: 'sectores'
    },
    {
        endpoint: 'domains',
        title: 'Dominios',
        singularName: 'dominio',
        pluralName: 'dominios'
    },
];

export default function NormativaPage() {
    const { isSuperAdmin } = usePermissions();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRegulation, setSelectedRegulation] = useState<Regulation | null>(null);
    const { data: regulations, isLoading, error } = useRegulations();

    const handleCreate = () => {
        setSelectedRegulation(null);
        setIsFormOpen(true);
    };

    const handleEdit = (regulation: Regulation) => {
        setSelectedRegulation(regulation);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedRegulation(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <LoadingSpinner size="large" text="Cargando normativas..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-center gap-3">
                    <Icon icon="mdi:alert-circle" width="24" height="24" className="text-red-500" />
                    <span className="text-red-700 dark:text-red-400">Error al cargar normativas: {error.message}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full p-6 space-y-6">
            {/* Sección principal */}
            <div className="space-y-6">
                <NormativaHeader onCreateClick={handleCreate} />
                <NormativaList regulations={regulations || []} onEdit={handleEdit} />
            </div>

            {/* Sección de catálogos - SOLO PARA SUPERADMIN */}
            {isSuperAdmin && (
                <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Icon icon="mdi:folder-cog" width="28" height="28" className="text-blue-400" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                Catálogos Auxiliares
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Administra las categorías de clasificación
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {CATALOG_CONFIGS.map((config) => (
                            <CatalogManager key={config.endpoint} config={config} />
                        ))}
                    </div>
                </div>
            )}

            {/* Modal del formulario */}
            {isFormOpen && (
                <NormativaForm regulation={selectedRegulation} onClose={handleCloseForm} />
            )}
        </div>
    );
}