import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import type { CatalogItem } from '../../types';
import LoadingSpinner from '../../../../../components/LoadingSpinner/LoadingSpinner';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white dark:bg-[#151824] rounded-xl shadow-2xl w-full max-w-sm">
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
                            className="w-full h-[40px] px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        />
                    </div>

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
                            className="flex-1 h-[36px] bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors disabled:bg-gray-400 flex items-center justify-center"
                        >
                            {isLoading ? <LoadingSpinner size="small" /> : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}