import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import ResolutionHeader from '../components/ResolutionHeader';
import ResolutionList from '../components/ResolutionList';
import ResolutionForm from '../components/ResolutionForm';
import CatalogManager from '../components/CatalogManager/CatalogManager';
import { useResolutions } from '../hooks/useResolution';
import type { Resolution, CatalogConfig } from '../types';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

const CATALOG_CONFIGS: CatalogConfig[] = [
    {
        endpoint: 'infringements',
        title: 'Infracciones',
        singularName: 'infracción',
        pluralName: 'infracciones',
        type: 'infringement',
    },
    {
        endpoint: 'sanction-types',
        title: 'Tipos de Sanción',
        singularName: 'tipo de sanción',
        pluralName: 'tipos de sanción',
        type: 'simple',
    },
];

export default function ResolutionPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedResolution, setSelectedResolution] = useState<Resolution | null>(null);
    const [shouldOpenModal, setShouldOpenModal] = useState<number | null>(null);

    const { data: resolutions, isLoading, error } = useResolutions();

    // ✅ Detectar si viene un resolutionId en la URL
    useEffect(() => {
        const resolutionId = searchParams.get('resolutionId');
        if (resolutionId && resolutions) {
            const id = parseInt(resolutionId, 10);
            setShouldOpenModal(id);
            // Limpiar el parámetro de la URL
            searchParams.delete('resolutionId');
            setSearchParams(searchParams);
        }
    }, [searchParams, resolutions, setSearchParams]);

    const handleCreate = () => {
        setSelectedResolution(null);
        setIsFormOpen(true);
    };

    const handleEdit = (resolution: Resolution) => {
        setSelectedResolution(resolution);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedResolution(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <LoadingSpinner size="large" text="Cargando resoluciones..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-center gap-3">
                    <Icon icon="mdi:alert-circle" width="24" height="24" className="text-red-500" />
                    <span className="text-red-700 dark:text-red-400">Error al cargar resoluciones: {error.message}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full max-w-[calc(100vw-280px)] p-6 space-y-6">
            {/* Sección principal */}
            <div className="space-y-6">
                <ResolutionHeader onCreateClick={handleCreate} />
                <ResolutionList
                    resolutions={resolutions || []}
                    onEdit={handleEdit}
                    autoOpenResolutionId={shouldOpenModal} // ✅ Pasar ID para abrir automáticamente
                    onModalOpened={() => setShouldOpenModal(null)} // ✅ Resetear después de abrir
                />
            </div>

            {/* Sección de catálogos */}
            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Icon icon="mdi:folder-cog" width="28" height="28" className="text-amber-400" />
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                            Catálogos Auxiliares
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Administra las categorías de clasificación
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CATALOG_CONFIGS.map((config) => (
                        <CatalogManager key={config.endpoint} config={config} />
                    ))}
                </div>
            </div>

            {/* Modal del formulario */}
            {isFormOpen && (
                <ResolutionForm resolution={selectedResolution} onClose={handleCloseForm} />
            )}
        </div>
    );
}