import { useState } from 'react';
import ResolutionHeader from '../components/ResolutionHeader';
import ResolutionList from '../components/ResolutionList';
import ResolutionForm from '../components/ResolutionForm';
import CatalogManager from '../components/CatalogManager/CatalogManager';
import { useResolutions } from '../hooks/useResolution';
import type { Resolution, CatalogConfig } from '../types';
import './ResolutionPage.css';

// 🆕 Configuración de los 2 catálogos (uno simple, uno complejo)
const CATALOG_CONFIGS: CatalogConfig[] = [
    {
        endpoint: 'infringements',
        title: 'Infracciones',
        singularName: 'infracción',
        pluralName: 'infracciones',
        type: 'infringement',  // 🆕 Tipo complejo
    },
    {
        endpoint: 'sanction-types',
        title: 'Tipos de Sanción',
        singularName: 'tipo de sanción',
        pluralName: 'tipos de sanción',
        type: 'simple',  // 🆕 Tipo simple
    },
];

export default function ResolutionPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedResolution, setSelectedResolution] = useState<Resolution | null>(null);
    const { data: resolutions, isLoading, error } = useResolutions();

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
            <div className="resolution-page">
                <div className="loading">Cargando resoluciones...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="resolution-page">
                <div className="error">Error al cargar resoluciones: {error.message}</div>
            </div>
        );
    }

    return (
        <div className="resolution-page">
            {/* SECCIÓN PRINCIPAL:   Resoluciones */}
            <section className="resolution-main-section">
                <ResolutionHeader onCreateClick={handleCreate} />
                <ResolutionList
                    resolutions={resolutions || []}
                    onEdit={handleEdit}
                />
                {isFormOpen && (
                    <ResolutionForm
                        resolution={selectedResolution}
                        onClose={handleCloseForm}
                    />
                )}
            </section>

            {/* SECCIÓN DE CATÁLOGOS */}
            <section className="catalogs-section">
                <h2 className="catalogs-title">Catálogos Auxiliares</h2>
                <div className="catalogs-grid">
                    {CATALOG_CONFIGS.map((config) => (
                        <CatalogManager key={config.endpoint} config={config} />
                    ))}
                </div>
            </section>
        </div>
    );
}