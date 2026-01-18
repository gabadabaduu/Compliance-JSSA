import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useCatalog } from '../../hooks/useCatalog';
import type { CatalogItem, CatalogType, Entity, Industry, CreateCatalogDto } from '../../types';
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

    const inputClass = `
        w-full h-[40px] px-4 rounded-lg border border-gray-300 dark:border-gray-700
        bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
        placeholder-gray-400 dark:placeholder-gray-500 
        focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent 
        transition-colors
    `;

    const textareaClass = `
        w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700
        bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
        placeholder-gray-400 dark:placeholder-gray-500 
        focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent 
        transition-colors resize-none
    `;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className={`relative bg-white dark:bg-[#151824] rounded-xl shadow-2xl w-full ${catalogType === 'entity' ? 'max-w-lg' : 'max-w-sm'}`}>
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
                        // Formulario Simple (Industry)
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
                        // Formulario Entity
                        <div className="space-y-4 mb-4">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nombre *
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={entityData.name}
                                    onChange={handleEntityChange}
                                    required
                                    className={inputClass}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="industry" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Industria *
                                </label>
                                <select
                                    id="industry"
                                    name="industry"
                                    value={entityData.industry}
                                    onChange={handleEntityChange}
                                    required
                                    className={inputClass}
                                >
                                    {(industries as any[] || []).map((ind) => (
                                        <option key={ind.id} value={ind.id}>
                                            {ind.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Descripción *
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    value={entityData.description}
                                    onChange={handleEntityChange}
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
                            className="flex-1 h-[36px] bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-lg transition-colors disabled:bg-gray-400 flex items-center justify-center"
                        >
                            {isLoading ? <LoadingSpinner size="small" /> : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}