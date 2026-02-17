import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useRopaDataFlows, useCreateRopaDataFlow } from '../hooks/useRat';
import type { RopaDataFlowDto, CreateRopaDataFlowDto } from '../services/ratService';

export default function Dataflow() {
    const navigate = useNavigate();

    const { data: dataflows, isLoading, error } = useRopaDataFlows();
    const createMutation = useCreateRopaDataFlow();

    const items: RopaDataFlowDto[] = dataflows ?? [];
    const errorMessage = (error as Error)?.message ?? 'Error desconocido';

    // modal / form state
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<CreateRopaDataFlowDto>({
        processingActivityId: undefined,
        entityId: undefined,
        entityRole: '',
        country: '',
        parentEntity: '',
        dataAgreement: '',
    });
    const [formError, setFormError] = useState<string | null>(null);

    const openForm = () => {
        setForm({
            processingActivityId: undefined,
            entityId: undefined,
            entityRole: '',
            country: '',
            parentEntity: '',
            dataAgreement: '',
        });
        setFormError(null);
        setShowForm(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'processingActivityId' || name === 'entityId') {
            setForm((s) => ({ ...s, [name]: value === '' ? undefined : Number(value) }));
        } else {
            // keep exact types: empty string -> '' (acceptable for optional string fields)
            setForm((s) => ({ ...s, [name]: value }));
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setFormError(null);

        // minimal validation
        if (!form.entityRole || form.entityRole.trim() === '') {
            setFormError('El rol de la entidad es obligatorio.');
            return;
        }

        try {
            await createMutation.mutateAsync(form);
            setShowForm(false);
            // reset form after success
            setForm({
                processingActivityId: undefined,
                entityId: undefined,
                entityRole: '',
                country: '',
                parentEntity: '',
                dataAgreement: '',
            });
        } catch (err) {
            console.error('Error creando dataflow', err);
            setFormError((err as Error)?.message ?? 'Error al crear registro');
        }
    };

    // react-query mutation status may be 'idle' | 'pending' | 'success' | 'error' in your setup
    const saving = createMutation.status === 'pending';

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

                    <div className="flex items-center gap-3">
                        <button
                            onClick={openForm}
                            className="px-3 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
                        >
                            + Agregar registro
                        </button>

                        <button
                            onClick={() => navigate('/app/rat')}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg"
                        >
                            <Icon icon="mdi:arrow-left" width="20" height="20" />
                            Volver
                        </button>
                    </div>
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
                                    <th className="p-2 border-b">ID</th>
                                    <th className="p-2 border-b">Processing Activity</th>
                                    <th className="p-2 border-b">Entity ID</th>
                                    <th className="p-2 border-b">Role</th>
                                    <th className="p-2 border-b">Country</th>
                                    <th className="p-2 border-b">Parent Entity</th>
                                    <th className="p-2 border-b">Data Agreement</th>
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

            {/* Modal simple */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-2xl bg-white dark:bg-[#0b1220] rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Agregar nuevo flujo de datos</h3>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm">Processing Activity ID</label>
                                    <input
                                        name="processingActivityId"
                                        type="number"
                                        value={form.processingActivityId ?? ''}
                                        onChange={handleChange}
                                        className="w-full border rounded px-2 py-1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm">Entity ID</label>
                                    <input
                                        name="entityId"
                                        type="number"
                                        value={form.entityId ?? ''}
                                        onChange={handleChange}
                                        className="w-full border rounded px-2 py-1"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm">Role (obligatorio)</label>
                                <input
                                    name="entityRole"
                                    value={form.entityRole}
                                    onChange={handleChange}
                                    className="w-full border rounded px-2 py-1"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm">Country</label>
                                <input name="country" value={form.country ?? ''} onChange={handleChange} className="w-full border rounded px-2 py-1" />
                            </div>

                            <div>
                                <label className="block text-sm">Parent Entity</label>
                                <input name="parentEntity" value={form.parentEntity ?? ''} onChange={handleChange} className="w-full border rounded px-2 py-1" />
                            </div>

                            <div>
                                <label className="block text-sm">Data Agreement</label>
                                <textarea
                                    name="dataAgreement"
                                    value={form.dataAgreement ?? ''}
                                    onChange={handleChange}
                                    className="w-full border rounded px-2 py-1"
                                    rows={3}
                                />
                            </div>

                            {formError && <div className="text-sm text-red-600">{formError}</div>}

                            <div className="flex items-center justify-end gap-3 mt-3">
                                <button type="button" onClick={() => setShowForm(false)} className="px-3 py-2 bg-gray-200 rounded">
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-3 py-2 bg-blue-600 text-white rounded"
                                    disabled={saving}
                                >
                                    {saving ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}