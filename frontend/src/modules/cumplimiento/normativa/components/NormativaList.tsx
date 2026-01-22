import { Icon } from '@iconify/react';
import { useDeleteRegulation } from '../hooks/useNormativa';
import type { Regulation } from '../types';

interface NormativaListProps {
    regulations: Regulation[];
    onEdit: (regulation: Regulation) => void;
}

export default function NormativaList({ regulations, onEdit }: NormativaListProps) {
    const deleteRegulation = useDeleteRegulation();

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar esta normativa?')) {
            try {
                await deleteRegulation.mutateAsync(id);
            } catch (error) {
                console.error('Error al eliminar normativa:', error);
                alert('Error al eliminar la normativa');
            }
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('es-ES');
    };

    if (regulations.length === 0) {
        return (
            <div className="bg-white dark: bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-12">
                <div className="flex flex-col items-center text-center">
                    <Icon icon="mdi:file-document-outline" width="64" height="64" className="text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                        No hay normativas registradas
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Crea una nueva normativa usando el botón superior
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-6">
            {/* Header de la tabla */}
            <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:format-list-bulleted" width="24" height="24" className="text-indigo-400" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Listado de Normativas
                </h2>
                <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">
                    {regulations.length}
                </span>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            {/* ✅ ORDEN EXACTO DEL EXCEL */}
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Number</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Issue Date</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Year</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Regulation</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark: text-gray-400 uppercase tracking-wider">Common Name</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden xl:table-cell">Title</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Authority</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark: text-gray-400 uppercase tracking-wider hidden lg:table-cell">Industry</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Domain</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark: text-gray-400 uppercase tracking-wider hidden md:table-cell">URL</th>
                            <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {regulations.map((regulation) => (
                            <tr
                                key={regulation.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                                {/* ✅ MISMO ORDEN QUE LAS COLUMNAS DEL HEADER */}

                                {/* 1.  Type */}
                                <td className="py-4 px-4">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {regulation.type}
                                    </span>
                                </td>

                                {/* 2. Number */}
                                <td className="py-4 px-4">
                                    <span className="font-mono text-sm font-medium text-gray-800 dark: text-gray-200">
                                        {regulation.number}
                                    </span>
                                </td>

                                {/* 3. Issue Date */}
                                <td className="py-4 px-4 hidden md:table-cell">
                                    <span className="text-sm text-gray-600 dark: text-gray-400">
                                        {formatDate(regulation.issueDate)}
                                    </span>
                                </td>

                                {/* 4. Year */}
                                <td className="py-4 px-4">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {regulation.year}
                                    </span>
                                </td>

                                {/* 5. Regulation */}
                                <td className="py-4 px-4 hidden lg:table-cell">
                                    <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2 max-w-xs" title={regulation.regulation}>
                                        {regulation.regulation}
                                    </p>
                                </td>

                                {/* 6. Common Name */}
                                <td className="py-4 px-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 max-w-xs" title={regulation.commonName}>
                                        {regulation.commonName}
                                    </p>
                                </td>

                                {/* 7. Title */}
                                <td className="py-4 px-4 hidden xl:table-cell">
                                    <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2 max-w-sm" title={regulation.title}>
                                        {regulation.title}
                                    </p>
                                </td>

                                {/* 8. Authority */}
                                <td className="py-4 px-4 hidden lg:table-cell">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {regulation.authority}
                                    </span>
                                </td>

                                {/* 9. Industry */}
                                <td className="py-4 px-4 hidden lg:table-cell">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {regulation.industry}
                                    </span>
                                </td>

                                {/* 10. Domain */}
                                <td className="py-4 px-4 hidden lg:table-cell">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {regulation.domain}
                                    </span>
                                </td>

                                {/* 11. Status */}
                                <td className="py-4 px-4">
                                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${regulation.status === 'Vigente'
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                                        }`}>
                                        {regulation.status}
                                    </span>
                                </td>

                                {/* 12. URL */}
                                <td className="py-4 px-4 hidden md:table-cell">
                                    {regulation.url ? (
                                        <a
                                            href={regulation.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-500 hover: text-blue-600 hover:underline"
                                            title="Ver documento"
                                        >
                                            <Icon icon="mdi:link-variant" width="18" height="18" className="inline" />
                                        </a>
                                    ) : (
                                        <span className="text-sm text-gray-400">-</span>
                                    )}
                                </td>

                                {/* 13. Acciones */}
                                <td className="py-4 px-4">
                                    <div className="flex items-center justify-center gap-1">
                                        {regulation.url && (
                                            <a
                                                href={regulation.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 hover:bg-blue-100 dark:hover: bg-blue-900/30 rounded-lg transition-colors md:hidden"
                                                title="Ver documento"
                                            >
                                                <Icon icon="mdi:open-in-new" width="18" height="18" className="text-blue-500" />
                                            </a>
                                        )}
                                        <button
                                            onClick={() => onEdit(regulation)}
                                            className="p-2 hover:bg-indigo-100 dark:hover: bg-indigo-900/30 rounded-lg transition-colors"
                                            title="Editar"
                                        >
                                            <Icon icon="mdi:pencil" width="18" height="18" className="text-indigo-500" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(regulation.id)}
                                            className="p-2 hover:bg-red-100 dark:hover: bg-red-900/30 rounded-lg transition-colors disabled: opacity-50"
                                            title="Eliminar"
                                            disabled={deleteRegulation.isPending}
                                        >
                                            <Icon icon="mdi:delete" width="18" height="18" className="text-red-500" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}