import { useState, useEffect } from 'react';
import type { CatalogItem } from '../../types';

interface Props {
    title: string;
    initialData: CatalogItem | null;
    onSubmit: (data: Omit<CatalogItem, 'id'>) => void;
    onClose: () => void;
    isLoading: boolean;
}

export default function CatalogForm({ title, initialData, onSubmit, onClose, isLoading }: Props) {
    const [name, setName] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit({ name: name.trim() });
        }
    };

    return (
        <div className="catalog-form-overlay" onClick={onClose}>
            <div className="catalog-form" onClick={(e) => e.stopPropagation()}>
                <div className="catalog-form-header">
                    <h3>{title}</h3>
                    <button className="btn-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Nombre</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ingrese el nombre"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-submit" disabled={isLoading}>
                            {isLoading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}