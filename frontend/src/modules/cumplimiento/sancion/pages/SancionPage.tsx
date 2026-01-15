import { useState } from 'react';
import SancionList from '../components/SancionList';
import SancionForm from '../components/SancionForm';
import type { Sanction } from '../types';
import './SancionPage.css';

export default function SancionPage() {
    const [showForm, setShowForm] = useState(false);
    const [editingSanction, setEditingSanction] = useState<Sanction | null>(null);

    const handleCreate = () => {
        setEditingSanction(null);
        setShowForm(true);
    };

    const handleEdit = (sanction: Sanction) => {
        setEditingSanction(sanction);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingSanction(null);
    };

    return (
        <div className="sancion-page">
            <div className="page-header">
                <div className="page-header-content">
                    <div>
                        <h1>Gestión de Sanciones</h1>
                        <p>Administra los procesos sancionatorios de la organización</p>
                    </div>
                    <button onClick={handleCreate} className="btn-primary">
                        + Nueva Sanción
                    </button>
                </div>
            </div>

            <SancionList
                onEdit={handleEdit}
                onCreate={handleCreate}
            />

            {showForm && (
                <SancionForm
                    sanction={editingSanction}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    );
}