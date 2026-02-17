import React from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useRopaDataFlows } from '../hooks/useRat';
import type { RopaDataFlowDto } from '../services/ratService';

export default function Dataflow() {
    const navigate = useNavigate();
    const { data: dataflows, isLoading, error } = useRopaDataFlows();

    // Normalizamos a un array tipado para que TypeScript no se queje al mapear
    const items: RopaDataFlowDto[] = dataflows ?? [];
    const errorMessage = (error as Error)?.message ?? 'Error desconocido';

    return (
        <div className="min-h-full p-6 space-y-6">
            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                            <Icon icon="mdi:swap-horizontal" width="32" height="32" className="text-purple-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Flujo de Datos</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Listado de flujos (ropa_data_flow)</p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/app/rat')}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors"
                    >
                        <Icon icon="mdi:arrow-left" width="20" height="20" />
                        Volver
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-6">
                {isLoading ? (
                    <div className="min-h-[200px] flex items-center justify-center text-gray-500">Cargando flujos de datos...</div>
                ) : error ? (
                    <div className="min-h-[200px] flex items-center justify-center text-red-600">Error al cargar flujos: {errorMessage}</div>
                ) : (
                    <div className="overflow-auto">
                        <table className="w-full table-auto border-collapse">
                            <thead>
                                <tr className="text-left bg-gray-50">
                                    <th className="p-2 border-b">Registro de tratamiento</th>
                                    <th className="p-2 border-b">Entidad</th>
                                    <th className="p-2 border-b">Rol de la Entidad</th>
                                    <th className="p-2 border-b">País de destino de los datos</th>
                                    <th className="p-2 border-b">Entidad Padre</th>
                                    <th className="p-2 border-b">Contrato/Acuerdo</th>
                                </tr>
                            </thead>

                            <tbody>
                                {items.map((df) => (
                                    <tr key={df.id} className="hover:bg-gray-50">
                                        <td className="p-2 border-b align-top">{df.id}</td>
                                        <td className="p-2 border-b align-top">{df.processingActivityId ?? '-'}</td>
                                        <td className="p-2 border-b align-top">{df.entityId ?? '-'}</td>
                                        <td className="p-2 border-b align-top">{df.entityRole ?? '-'}</td>
                                        <td className="p-2 border-b align-top">{df.country ?? '-'}</td>
                                        <td className="p-2 border-b align-top">{df.parentEntity ?? '-'}</td>
                                        <td className="p-2 border-b align-top whitespace-pre-wrap">{df.dataAgreement ?? '-'}</td>
                                    </tr>
                                ))}

                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="p-4 text-center text-gray-500">
                                            No se encontraron flujos de datos.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}