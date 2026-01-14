import { useState } from 'react';
import SancionHeader from '../components/SancionHeader';
import SancionList from '../components/SancionList';
import SancionForm from '../components/SancionForm';
import { useSanctions } from '../hooks/useSancion';
import type { Sanction } from '../types';
import './SancionPage.css';

export default function SancionPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedSanction, setSelectedSanction] = useState<Sanction | null>(null);
    const { data: sanctions, isLoading, error } = useSanctions();

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

    if (isLoading) {
        return (
            <div className="sancion-page">
                <div className="loading">Cargando sanciones...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="sancion-page">
                <div className="error">Error al cargar sanciones: {error.message}</div>
            </div>
        );
    }

    return (
        <div className="sancion-page">
            <SancionHeader onCreateClick={handleCreate} />
            <SancionList
                sanctions={sanctions || []}
                onEdit={handleEdit}
            />
            {isFormOpen && (
                <SancionForm
                    sanction={selectedSanction}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    );
}