import { useState } from 'react';
import { Icon } from '@iconify/react';
import RopaTableHeader from '../components/RatHeader';
import RopaTableList from '../components/RatList';
import RopaTableForm from '../components/RatForm';
import { useRopaTable } from '../hooks/useRat';
import type { RopaTable } from '../types';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

export default function RopaTablePage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<RopaTable | null>(null);
    const { data: records, isLoading, error } = useRopaTable();

    const handleCreate = () => {
        setSelectedRecord(null);
        setIsFormOpen(true);
    };

    const handleEdit = (record: RopaTable) => {
        setSelectedRecord(record);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedRecord(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <LoadingSpinner size="large" text="Cargando registros..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-center gap-3">
                    <Icon icon="mdi:alert-circle" width="24" height="24" className="text-red-500" />
                    <span className="text-red-700 dark:text-red-400">
                        Error al cargar registros: {error.message}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full p-6 space-y-6">
            <div className="space-y-6">
                <RopaTableHeader onCreateClick={handleCreate} />
                <RopaTableList records={records || []} onEdit={handleEdit} />
            </div>

            {isFormOpen && (
                <RopaTableForm record={selectedRecord} onClose={handleCloseForm} />
            )}
        </div>
    );
}