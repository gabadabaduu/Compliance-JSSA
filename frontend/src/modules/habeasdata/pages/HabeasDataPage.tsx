import { useState } from 'react';
import { Icon } from '@iconify/react';
import HabeasDataHeader from '../components/HabeasDataHeader';
import HabeasDataList from '../components/HabeasDataList';
import HabeasDataForm from '../components/HabeasDataForm';
import { useDsrs } from '../hooks/useHabeasData';
import type { Dsr } from '../types';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';

export default function HabeasDataPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedDsr, setSelectedDsr] = useState<Dsr | null>(null);
    const { data: dsrs, isLoading, error } = useDsrs();

    const handleCreate = () => {
        setSelectedDsr(null);
        setIsFormOpen(true);
    };

    const handleEdit = (dsr: Dsr) => {
        setSelectedDsr(dsr);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedDsr(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <LoadingSpinner size="large" text="Cargando solicitudes DSR..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-center gap-3">
                    <Icon icon="mdi:alert-circle" width="24" height="24" className="text-red-500" />
                    <span className="text-red-700 dark:text-red-400">
                        Error al cargar solicitudes DSR: {error.message}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full p-6 space-y-6">
            {/* Sección principal */}
            <div className="space-y-6">
                <HabeasDataHeader onCreateClick={handleCreate} />
                <HabeasDataList dsrs={dsrs || []} onEdit={handleEdit} />
            </div>

            {/* Modal del formulario */}
            {isFormOpen && (
                <HabeasDataForm dsr={selectedDsr} onClose={handleCloseForm} />
            )}
        </div>
    );
}