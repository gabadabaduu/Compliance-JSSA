import { Icon } from '@iconify/react';

interface Props {
    title: string;
    count: number;
    onAdd: () => void;
}

export default function CatalogHeader({ title, count, onAdd }: Props) {
    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#151824]">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {title}
                </h3>
                <span className="px-1.5 py-0.5 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                    {count}
                </span>
            </div>
            <button
                onClick={onAdd}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded transition-colors"
            >
                <Icon icon="mdi:plus" width="14" height="14" />
                Agregar
            </button>
        </div>
    );
}