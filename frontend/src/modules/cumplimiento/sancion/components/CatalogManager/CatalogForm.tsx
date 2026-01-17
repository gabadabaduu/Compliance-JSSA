import { useState, useEffect } from 'react';
import { useCatalog } from '../../hooks/useCatalog';
import type { CatalogItem, CatalogType, Entity, Industry, CreateCatalogDto } from '../../types';

interface Props {
    title: string;
    initialData: CatalogItem | null;
    onSubmit: (data: CreateCatalogDto) => void;
    onClose: () => void;
    isLoading: boolean;
    catalogType: CatalogType;
}

export default function CatalogForm({ title, initialData, onSubmit, onClose, isLoading, catalogType }: Props) {
    // Estado para catálogo simple (Industry)
    const [name, setName] = useState('');

    // Estado para Entity
    const [entityData, setEntityData] = useState({
        name: '',
        industry: 1,
        description: '',
    });

    // Cargar industries para el select
    const { data: industries } = useCatalog('industries');

    useEffect(() => {
        if (initialData) {
            if (catalogType === 'simple') {
                setName((initialData as Industry).name);
            } else if (catalogType === 'entity') {
                const entity = initialData as Entity;
                setEntityData({
                    name: entity.name,
                    industry: entity.industry,
                    description: entity.description,
                });
            }
        }
    }, [initialData, catalogType]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (catalogType === 'simple') {
            if (name.trim()) {
                onSubmit({ name: name.trim() });
            }
        } else if (catalogType === 'entity') {
            if (entityData.name.trim() && entityData.description.trim()) {
                onSubmit(entityData);
            }
        }
    };

    const handleEntityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEntityData(prev => ({
            ...prev,
            [name]: name === 'industry' ? parseInt(value) || 1 : value
        }));
    };

    return (
        <div className="catalog-form-overlay" onClick={onClose}>
            <div className={`catalog-form ${catalogType === 'entity' ? 'catalog-form-large' : ''}`} onClick={(e) => e.stopPropagation()}>
                <div className="catalog-form-header">
                    <h3>{title}</h3>
                    <button className="btn-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {catalogType === 'simple' ? (
                        // 🟢 FORMULARIO SIMPLE (Industry)
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
                    ) : (
                        // 🟡 FORMULARIO ENTITY
                        <>
                            <div className="form-group">
                                <label htmlFor="name">Nombre *</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={entityData.name}
                                    onChange={handleEntityChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="industry">Industria *</label>
                                <select
                                    id="industry"
                                    name="industry"
                                    value={entityData.industry}
                                    onChange={handleEntityChange}
                                    required
                                >
                                    {(industries as any[]).map((ind) => (
                                        <option key={ind.id} value={ind.id}>
                                            {ind.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Descripción *</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    value={entityData.description}
                                    onChange={handleEntityChange}
                                    required
                                />
                            </div>
                        </>
                    )}

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