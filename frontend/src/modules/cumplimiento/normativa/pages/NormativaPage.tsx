import { useState } from 'react';
import NormativaHeader from '../components/NormativaHeader';
import NormativaList from '../components/NormativaList';
import NormativaForm from '../components/NormativaForm';
import CatalogManager from '../components/CatalogManager/CatalogManager';
import { useRegulations } from '../hooks/useNormativa';
import type { Regulation, CatalogConfig } from '../types';
import './NormativaPage.css';

// 🆕 Configuración de los 4 catálogos
const CATALOG_CONFIGS: CatalogConfig[] = [
    {
        endpoint: 'industries',
        title: 'Industrias',
        singularName: 'industria',
        pluralName: 'industrias',
    },
    {
        endpoint: 'types',
        title: 'Tipos de Normativa',
        singularName: 'tipo',
        pluralName: 'tipos',
    },
    {
        endpoint: 'authorities',
        title: 'Autoridades',
        singularName: 'autoridad',
        pluralName: 'autoridades',
    },
    {
        endpoint: 'domains',
        title: 'Dominios',
        singularName: 'dominio',
        pluralName: 'dominios',
    },
];

export default function NormativaPage() {
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
            <div className="normativa-page">
                <div className="loading">Cargando normativas... </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="normativa-page">
                <div className="error">Error al cargar normativas: {error.message}</div>
            </div>
        );
    }

    return (
        <div className="normativa-page">
            {/* SECCIÓN PRINCIPAL:  Normativas */}
            <section className="normativa-main-section">
                <NormativaHeader onCreateClick={handleCreate} />
                <NormativaList
                    regulations={regulations || []}
                    onEdit={handleEdit}
                />
                {isFormOpen && (
                    <NormativaForm
                        regulation={selectedRegulation}
                        onClose={handleCloseForm}
                    />
                )}
            </section>

            {/* 🆕 SECCIÓN DE CATÁLOGOS */}
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