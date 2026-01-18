import { Icon } from '@iconify/react';
import type { CatalogItem } from '../../types';

interface Props {
    items: CatalogItem[];
    onEdit: (item: CatalogItem) => void;
    onDelete: (id: number) => void;
    singularName: string;
}

export default function CatalogList({ items, onEdit, onDelete, singularName }: Props) {
    if (items.length === 0) {
        return (
            <div className="p-6 text-center">
                <Icon icon="mdi:folder-open-outline" width="32" height="32" className="text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    No hay {singularName}s registrados
                </p>
            </div>
        );
    }

    return (
        <div className="max-h-48 overflow-y-auto">
            {items.map((item) => (
                <div 
                    key={item.id} 
                    className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                >
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                        {item.name}
                    </span>
                    <div className="flex items-center gap-1 ml-2">
                        <button
                            onClick={() => onEdit(item)}
                            className="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded transition-colors"
                            title="Editar"
                        >
                            <Icon icon="mdi:pencil" width="14" height="14" className="text-indigo-500" />
                        </button>
                        <button
                            onClick={() => onDelete(item.id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                            title="Eliminar"
                        >
                            <Icon icon="mdi:delete" width="14" height="14" className="text-red-500" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}