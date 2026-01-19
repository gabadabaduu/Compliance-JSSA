import { Icon } from '@iconify/react';
import type { CatalogItem, CatalogType, Entity, Industry } from '../../types';

interface Props {
    items: CatalogItem[];
    onEdit: (item: CatalogItem) => void;
    onDelete: (id: number) => void;
    singularName: string;
    catalogType: CatalogType;
}

export default function CatalogList({ items, onEdit, onDelete, singularName, catalogType }: Props) {
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

    // Renderizado para Entity (tabla compleja)
    if (catalogType === 'entity') {
        return (
            <div className="overflow-x-auto">
                {/* Header de tabla */}
                <div className="grid grid-cols-[1fr_120px_1fr_100px_80px] gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                    <span>Nombre</span>
                    <span>NIT/Tax ID</span>
                    <span>Industria</span>
                    <span>Tamaño</span>
                    <span className="text-center">Acciones</span>
                </div>

                {/* Filas */}
                <div className="max-h-48 overflow-y-auto">
                    {(items as Entity[]).map((item) => (
                        <div
                            key={item.id}
                            className="grid grid-cols-[1fr_120px_1fr_100px_80px] gap-2 px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors items-center"
                        >
                            <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                {item.name}
                            </span>
                            <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                {item.taxId}
                            </span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                {item.industry}
                            </span>
                            <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                {item.companySize}
                            </span>
                            <div className="flex items-center justify-center gap-1">
                                <button
                                    onClick={() => onEdit(item)}
                                    className="p-1 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded transition-colors"
                                    title="Editar"
                                >
                                    <Icon icon="mdi:pencil" width="14" height="14" className="text-rose-500" />
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
            </div>
        );
    }

    // Renderizado para catálogos simples (Industry)
    return (
        <div className="max-h-48 overflow-y-auto">
            {(items as Industry[]).map((item) => (
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
                            className="p-1 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded transition-colors"
                            title="Editar"
                        >
                            <Icon icon="mdi:pencil" width="14" height="14" className="text-rose-500" />
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