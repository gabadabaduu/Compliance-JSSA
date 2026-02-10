import { useState } from 'react';
import { Icon } from '@iconify/react';
import { usePermissions } from '../../../../hooks/usePermissions'; 
import SancionHeader from '../components/SancionHeader';
import SancionList from '../components/SancionList';
import SancionForm from '../components/SancionForm';
import CatalogManager from '../components/CatalogManager/CatalogManager';
import type { Sanction, CatalogConfig } from '../types';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

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
    const { isSuperAdmin } = usePermissions(); 
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
        <div className="min-h-full p-6 space-y-6">
            {/* Sección principal */}
            <div className="space-y-6">
                <SancionHeader onCreateClick={handleCreate} />
                <SancionList onEdit={handleEdit} onCreate={handleCreate} />
            </div>

            {/* ✅ Sección de catálogos - SOLO PARA SUPERADMIN */}
            {isSuperAdmin && (
                <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Icon icon="mdi:folder-cog" width="28" height="28" className="text-rose-400" />
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
            )}

            {/* Modal del formulario */}
            {isFormOpen && (
                <SancionForm sanction={selectedSanction} onClose={handleCloseForm} />
            )}
        </div>
    );
}