import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';
import { getAllResolutions } from '../../services/resolutionService';
import type { CatalogItem, CatalogType, Infringement, SanctionType, CreateCatalogDto, Resolution } from '../../types';
import LoadingSpinner from '../../../../../components/LoadingSpinner/LoadingSpinner';

interface Props {
    title: string;
    initialData: CatalogItem | null;
    onSubmit: (data: CreateCatalogDto) => void;
    onClose: () => void;
    isLoading: boolean;
    catalogType: CatalogType;
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
        queryFn: () => getAllResolutions(),
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

    const inputClass = `
        w-full h-[40px] px-4 rounded-lg border border-gray-300 dark:border-gray-700
        bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
        placeholder-gray-400 dark:placeholder-gray-500 
        focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent 
        transition-colors
    `;

    const textareaClass = `
        w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700
        bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
        placeholder-gray-400 dark:placeholder-gray-500 
        focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent 
        transition-colors resize-none
    `;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className={`relative bg-white dark:bg-[#151824] rounded-xl shadow-2xl w-full ${catalogType === 'infringement' ? 'max-w-lg' : 'max-w-sm'}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {title}
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                        <Icon icon="mdi:close" width="20" height="20" className="text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4">
                    {catalogType === 'simple' ? (
                        // Formulario Simple
                        <div className="flex flex-col gap-2 mb-4">
                            <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nombre
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ingrese el nombre"
                                required
                                autoFocus
                                className={inputClass}
                            />
                        </div>
                    ) : (
                        // Formulario Infringement
                        <div className="space-y-4 mb-4">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="statute" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Estatuto (Regulación) *
                                </label>
                                <select
                                    id="statute"
                                    name="statute"
                                    value={infringementData.statute}
                                    onChange={handleInfringementChange}
                                    required
                                    className={inputClass}
                                >
                                    {regulations?.map((reg: Resolution) => (
                                        <option key={reg.id} value={reg.id}>
                                            {reg.number} - {reg.resolution}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="article" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Artículo *
                                    </label>
                                    <input
                                        id="article"
                                        name="article"
                                        type="number"
                                        value={infringementData.article}
                                        onChange={handleInfringementChange}
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="section" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Sección *
                                    </label>
                                    <input
                                        id="section"
                                        name="section"
                                        type="text"
                                        value={infringementData.section}
                                        onChange={handleInfringementChange}
                                        required
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Descripción *
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    value={infringementData.description}
                                    onChange={handleInfringementChange}
                                    required
                                    className={textareaClass}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="interpretation" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Interpretación *
                                </label>
                                <textarea
                                    id="interpretation"
                                    name="interpretation"
                                    rows={3}
                                    value={infringementData.interpretation}
                                    onChange={handleInfringementChange}
                                    required
                                    className={textareaClass}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 h-[36px] bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 h-[36px] bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors disabled:bg-gray-400 flex items-center justify-center"
                        >
                            {isLoading ? <LoadingSpinner size="small" /> : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}