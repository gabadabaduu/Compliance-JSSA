import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SancionHeader from "../components/SancionHeader";
import SancionList from "../components/SancionList";
import SancionForm from "../components/SancionForm";
import { getSanctionById } from "../services/sancionService";
import type { Sanction } from "../types";

export default function SancionPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedSanction, setSelectedSanction] = useState<Sanction | null>(null);

    useEffect(() => {
        // Si viene ?sanctionId=123 abrir modal con esa sanción
        const sid = searchParams.get('sanctionId');
        if (sid) {
            const id = parseInt(sid, 10);
            if (!isNaN(id)) {
                // obtener sanción desde API y abrir modal
                getSanctionById(id)
                    .then((s) => {
                        if (s) {
                            setSelectedSanction(s);
                            setIsFormOpen(true);
                        } else {
                            console.warn('Sanción no encontrada', id);
                        }
                    })
                    .catch(err => console.error('Error al obtener sanción por id:', err));
            }
            // limpiar param de URL
            searchParams.delete('sanctionId');
            setSearchParams(searchParams);
        }
    }, [searchParams, setSearchParams]);

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
            <div className="space-y-6">
                <SancionHeader onCreateClick={handleCreate} />
                <SancionList onEdit={handleEdit} onCreate={handleCreate} />
            </div>

            {/* Modal del formulario */}
            {isFormOpen && (
                <SancionForm sanction={selectedSanction} onClose={handleCloseForm} />
            )}
        </div>
    );
}