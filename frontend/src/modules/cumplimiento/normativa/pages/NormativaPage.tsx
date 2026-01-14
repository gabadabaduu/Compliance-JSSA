import { useState } from 'react';
import NormativaHeader from '../components/NormativaHeader';
import NormativaList from '../components/NormativaList';
import NormativaForm from '../components/NormativaForm';
import { useRegulations } from '../hooks/useNormativa';
import type { Regulation } from '../types';
import './NormativaPage.css';

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
                <div className="loading">Cargando normativas...</div>
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
        </div>
    );
}