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

    // form/modal state (kept minimal)
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
            setForm((s) => ({ ...s, [name]: value }));
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setFormError(null);

        if (!form.entityRole || form.entityRole.trim() === '') {
            setFormError('El rol de la entidad es obligatorio.');
            return;
        }

        try {
            await createMutation.mutateAsync(form);
            setShowForm(false);
            setForm({
                processingActivityId: undefined,
                entityId: undefined,
                entityRole: '',
                country: '',
                parentEntity: '',
                dataAgreement: '',
            });
        } catch (err) {
            setFormError((err as Error)?.message ?? 'Error al crear registro');
        }
    };

    // your react-query status literal for "in progress" appears to be 'pending'
    const saving = createMutation.status === 'pending';

    return (
        <div className="min-h-full p-6">
            {/* Card wrapper with dark background similar to habeas data */}
            <div className="bg-[#07121a] rounded-md shadow-sm overflow-hidden">
                {/* Header / toolbar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                    <div>
                        <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wider">Nombre</h2>
                        <p className="text-xs text-gray-500 mt-1">Listado de flujos de datos</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={openForm}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-[#6b46c1] hover:bg-[#7b57d6] text-white rounded-md text-sm"
                        >
                            <Icon icon="mdi:plus" width="16" height="16" />
                            Agregar
                        </button>

                        <button
                            onClick={() => navigate('/app/rat')}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-transparent border border-gray-800 text-gray-400 rounded-md text-sm"
                        >
                            <Icon icon="mdi:arrow-left" width="16" height="16" />
                            Volver
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-auto">
                    {isLoading ? (
                        <div className="p-6 text-center text-gray-400">Cargando flujos de datos...</div>
                    ) : error ? (
                        <div className="p-6 text-center text-red-500">Error al cargar flujos: {errorMessage}</div>
                    ) : (
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="border-b border-gray-800">
                                    <th className="px-8 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Nombre</th>
                                    <th className="px-8 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Processing Activity</th>
                                    <th className="px-8 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Entity ID</th>
                                    <th className="px-8 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                                    <th className="px-8 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Country</th>
                                    <th className="px-8 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Parent Entity</th>
                                    <th className="px-8 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Data Agreement</th>
                                    <th className="px-8 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {items.map((df) => (
                                    <tr key={df.id} className="border-b border-gray-800 last:border-b-0 hover:bg-[#08121a]">
                                        <td className="px-8 py-6 text-left">
                                            <div className="font-semibold text-gray-100">{/* Example: combine fields if you need a "name" */}
                                                {df.entityRole ? df.entityRole : `ID ${df.id}`}
                                            </div>
                                        </td>

                                        <td className="px-8 py-6 text-center text-sm text-gray-300">{df.processingActivityId ?? '-'}</td>
                                        <td className="px-8 py-6 text-center text-sm text-gray-300">{df.entityId ?? '-'}</td>
                                        <td className="px-8 py-6 text-center text-sm text-gray-300">{df.entityRole ?? '-'}</td>
                                        <td className="px-8 py-6 text-center text-sm text-gray-300">{df.country ?? '-'}</td>
                                        <td className="px-8 py-6 text-center text-sm text-gray-300">{df.parentEntity ?? '-'}</td>
                                        <td className="px-8 py-6 text-center text-sm text-gray-300 whitespace-pre-wrap">{df.dataAgreement ?? '-'}</td>

                                        <td className="px-8 py-6 text-right">
                                            <div className="inline-flex items-center gap-3 justify-end">
                                                <button
                                                    onClick={() => openForm()}
                                                    title="Editar"
                                                    className="p-1 rounded hover:bg-transparent"
                                                >
                                                    <Icon icon="mdi:pencil" width="18" height="18" className="text-[#9f7aea]" />
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        // implement delete flow or call delete hook
                                                        // e.g. deleteMutation.mutate(df.id)
                                                        console.log('Eliminar', df.id);
                                                    }}
                                                    title="Eliminar"
                                                    className="p-1 rounded hover:bg-transparent"
                                                >
                                                    <Icon icon="mdi:trash-can-outline" width="18" height="18" className="text-[#ff6b6b]" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-8 py-8 text-center text-gray-500">
                                            No se encontraron flujos de datos.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Simple modal (keeps same dark style) */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-2xl bg-[#07121a] rounded-md p-6 border border-gray-800">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-100">Agregar flujo de datos</h3>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-200">
                                <Icon icon="mdi:close" width="18" height="18" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Processing Activity ID</label>
                                    <input
                                        name="processingActivityId"
                                        type="number"
                                        value={form.processingActivityId ?? ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded bg-[#06101a] text-gray-200 border border-gray-800"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Entity ID</label>
                                    <input
                                        name="entityId"
                                        type="number"
                                        value={form.entityId ?? ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded bg-[#06101a] text-gray-200 border border-gray-800"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Role (obligatorio)</label>
                                <input
                                    name="entityRole"
                                    value={form.entityRole}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 rounded bg-[#06101a] text-gray-200 border border-gray-800"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Country</label>
                                    <input
                                        name="country"
                                        value={form.country ?? ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded bg-[#06101a] text-gray-200 border border-gray-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Parent Entity</label>
                                    <input
                                        name="parentEntity"
                                        value={form.parentEntity ?? ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded bg-[#06101a] text-gray-200 border border-gray-800"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Data Agreement</label>
                                <textarea
                                    name="dataAgreement"
                                    value={form.dataAgreement ?? ''}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-3 py-2 rounded bg-[#06101a] text-gray-200 border border-gray-800"
                                />
                            </div>

                            {formError && <div className="text-sm text-red-500">{formError}</div>}

                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setShowForm(false)} className="px-3 py-2 bg-transparent border border-gray-800 text-gray-400 rounded">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={saving} className="px-4 py-2 bg-[#6b46c1] text-white rounded">
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