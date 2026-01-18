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
            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-12">
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
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Número</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Título</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Nombre Común</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Año</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Fecha</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                            <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {regulations.map((regulation) => (
                            <tr 
                                key={regulation.id} 
                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                                <td className="py-4 px-4">
                                    <span className="font-mono text-sm font-medium text-gray-800 dark:text-gray-200">
                                        {regulation.number}
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2" title={regulation.title}>
                                        {regulation.title}
                                    </p>
                                </td>
                                <td className="py-4 px-4 hidden lg:table-cell">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1" title={regulation.commonName}>
                                        {regulation.commonName}
                                    </p>
                                </td>
                                <td className="py-4 px-4">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {regulation.year}
                                    </span>
                                </td>
                                <td className="py-4 px-4 hidden md:table-cell">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {formatDate(regulation.issueDate)}
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                                        regulation.status === 'Vigente'
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                                    }`}>
                                        {regulation.status}
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center justify-center gap-1">
                                        {regulation.url && (
                                            <a
                                                href={regulation.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                title="Ver documento"
                                            >
                                                <Icon icon="mdi:open-in-new" width="18" height="18" className="text-blue-500" />
                                            </a>
                                        )}
                                        <button
                                            onClick={() => onEdit(regulation)}
                                            className="p-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                            title="Editar"
                                        >
                                            <Icon icon="mdi:pencil" width="18" height="18" className="text-indigo-500" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(regulation.id)}
                                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
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