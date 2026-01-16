import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllRegulations } from '../../services/resolutionService';
import type { CatalogItem, CatalogType, Infringement, SanctionType, CreateCatalogDto } from '../../types';

interface Props {
    title: string;
    initialData: CatalogItem | null;
    onSubmit: (data: CreateCatalogDto) => void;
    onClose: () => void;
    isLoading: boolean;
    catalogType: CatalogType;  // 🆕
}

export default function CatalogForm({ title, initialData, onSubmit, onClose, isLoading, catalogType }: Props) {
    // Estado para catálogo simple
    const [name, setName] = useState('');

    // Estado para infringement
    const [infringementData, setInfringementData] = useState({
        statute: 1,
        article: 0,
        section: '',
        description: '',
        interpretation: '',
    });

    // Cargar regulations para el select de statute
    const { data: regulations } = useQuery({
        queryKey: ['regulations'],
        queryFn: () => getAllRegulations(),
        enabled: catalogType === 'infringement',
    });

    useEffect(() => {
        if (initialData) {
            if (catalogType === 'simple') {
                setName((initialData as SanctionType).name);
            } else if (catalogType === 'infringement') {
                const infr = initialData as Infringement;
                setInfringementData({
                    statute: infr.statute,
                    article: infr.article,
                    section: infr.section,
                    description: infr.description,
                    interpretation: infr.interpretation,
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
        } else if (catalogType === 'infringement') {
            if (infringementData.section.trim() && infringementData.description.trim()) {
                onSubmit(infringementData);
            }
        }
    };

    const handleInfringementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setInfringementData(prev => ({
            ...prev,
            [name]: name === 'statute' || name === 'article' ? parseInt(value) || 0 : value
        }));
    };

    return (
        <div className="catalog-form-overlay" onClick={onClose}>
            <div className={`catalog-form ${catalogType === 'infringement' ? 'catalog-form-large' : ''}`} onClick={(e) => e.stopPropagation()}>
                <div className="catalog-form-header">
                    <h3>{title}</h3>
                    <button className="btn-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {catalogType === 'simple' ? (
                        // 🟢 FORMULARIO SIMPLE
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
                        // 🟡 FORMULARIO INFRINGEMENT
                        <>
                            <div className="form-group">
                                <label htmlFor="statute">Estatuto (Regulación) *</label>
                                <select
                                    id="statute"
                                    name="statute"
                                    value={infringementData.statute}
                                    onChange={handleInfringementChange}
                                    required
                                >
                                    {regulations?.map((reg) => (
                                        <option key={reg.id} value={reg.id}>
                                            {reg.commonName || reg.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="article">Artículo *</label>
                                <input
                                    id="article"
                                    name="article"
                                    type="number"
                                    value={infringementData.article}
                                    onChange={handleInfringementChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="section">Sección *</label>
                                <input
                                    id="section"
                                    name="section"
                                    type="text"
                                    value={infringementData.section}
                                    onChange={handleInfringementChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Descripción *</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    value={infringementData.description}
                                    onChange={handleInfringementChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="interpretation">Interpretación *</label>
                                <textarea
                                    id="interpretation"
                                    name="interpretation"
                                    rows={3}
                                    value={infringementData.interpretation}
                                    onChange={handleInfringementChange}
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