import { useState } from 'react';
import SancionHeader from '../components/SancionHeader';
import SancionList from '../components/SancionList';
import SancionForm from '../components/SancionForm';
import CatalogManager from '../components/CatalogManager/CatalogManager';
import type { Sanction, CatalogConfig } from '../types';
import './SancionPage.css';

// Configuración de los 2 catálogos
const CATALOG_CONFIGS: CatalogConfig[] = [
    {
        endpoint: 'entities',
        title: 'Entidades',
        singularName: 'entidad',
        pluralName: 'entidades',
        type: 'entity',
    },
    {
        endpoint: 'industries',
        title: 'Industrias',
        singularName: 'industria',
        pluralName: 'industrias',
        type: 'simple',
    },
];

export default function SancionPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedSanction, setSelectedSanction] = useState<Sanction | null>(null);

    const handleCreate = () => {
        setSelectedSanction(null);
        setIsFormOpen(true);
    };

    const handleEdit = (sanction: Sanction) => {
        setSelectedSanction(sanction);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedSanction(null);
    };

    return (
        <div className="sancion-page">
            {/* SECCIÓN PRINCIPAL:  Sanciones */}
            <section className="sancion-main-section">
                <SancionHeader onCreateClick={handleCreate} />

                {/* ✅ SancionList obtiene los datos internamente con useSanctions() */}
                <SancionList
                    onEdit={handleEdit}
                    onCreate={handleCreate}
                />

                {isFormOpen && (
                    <SancionForm
                        sanction={selectedSanction}
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