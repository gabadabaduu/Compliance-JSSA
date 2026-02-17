import React, { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import {
    useRopaDataFlows,
    useCreateRopaDataFlow,
    useRopaEntities,
    useRopaContracts,
} from '../hooks/useRat';
import COUNTRIES from '../../../../constants/countries';
import type { RopaDataFlowDto, CreateRopaDataFlowDto } from '../services/ratService';

const ROLE_OPTIONS = ['Responsable', 'Área Interna', 'Encargado', 'Subencargado'];

export default function Dataflow() {
    const navigate = useNavigate();

    const { data: dataflows, isLoading, error } = useRopaDataFlows();
    const createMutation = useCreateRopaDataFlow();

    const { data: entities } = useRopaEntities();
    const { data: contracts } = useRopaContracts();
    const countries = COUNTRIES;

    const entityMap = useMemo(() => {
        const m = new Map<number, string>();
        (entities ?? []).forEach((e) => m.set(e.id, e.name));
        return m;
    }, [entities]);

    const contractMap = useMemo(() => {
        const m = new Map<number, string>();
        (contracts ?? []).forEach((c) => m.set(c.id, c.name));
        return m;
    }, [contracts]);

    const countryMap = useMemo(() => {
        const m = new Map<string, string>();
        (countries ?? []).forEach((c) => m.set(String(c.id), c.name));
        return m;
    }, [countries]);

    const items: RopaDataFlowDto[] = dataflows ?? [];
    const errorMessage = (error as Error)?.message ?? 'Error desconocido';

    // form/modal state
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

    const openForm = (item?: RopaDataFlowDto) => {
        if (item) {
            setForm({
                processingActivityId: item.processingActivityId ?? undefined,
                entityId: item.entityId ?? undefined,
                entityRole: item.entityRole ?? '',
                country: item.country ?? '',
                parentEntity: item.parentEntity ?? '',
                dataAgreement: item.dataAgreement ?? '',
            });
        } else {
            setForm({
                processingActivityId: undefined,
                entityId: undefined,
                entityRole: '',
                country: '',
                parentEntity: '',
                dataAgreement: '',
            });
        }
        setFormError(null);
        setShowForm(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // numeric ids -> convert for processingActivityId and entityId
        if (name === 'processingActivityId' || name === 'entityId') {
            setForm((s) => ({ ...s, [name]: value === '' ? undefined : Number(value) } as any));
            return;
        }
        // others keep as strings
        setForm((s) => ({ ...s, [name]: value } as any));
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setFormError(null);

        if (!form.entityRole || form.entityRole.trim() === '') {
            setFormError('El rol de la entidad es obligatorio.');
            return;
        }

        const payload: CreateRopaDataFlowDto = {
            processingActivityId: form.processingActivityId && form.processingActivityId > 0 ? form.processingActivityId : undefined,
            entityId: form.entityId && form.entityId > 0 ? form.entityId : undefined,
            entityRole: form.entityRole?.trim() ?? '',
            country: form.country?.trim() ?? '',
            parentEntity: form.parentEntity?.trim() ?? '',
            dataAgreement: form.dataAgreement?.trim() ?? '',
        };

        try {
            await createMutation.mutateAsync(payload);
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

    const saving = createMutation.status === 'pending';

    // display helpers
    const getProcessingActivityDisplay = (df: RopaDataFlowDto) =>
        (df as any).processingActivityName ?? (df.processingActivityId ? String(df.processingActivityId) : '-');

    const getEntityDisplay = (df: RopaDataFlowDto) =>
        (df as any).entityName ?? (df.entityId ? entityMap.get(Number(df.entityId)) ?? String(df.entityId) : '-');

    const getCountryDisplay = (df: RopaDataFlowDto) =>
        (df as any).countryName ?? countryMap.get(String(df.country ?? '')) ?? df.country ?? '-';

    const getParentEntityDisplay = (df: RopaDataFlowDto) =>
        (df as any).parentEntityName ?? entityMap.get(Number(df.parentEntity ?? '')) ?? df.parentEntity ?? '-';

    const getDataAgreementDisplay = (df: RopaDataFlowDto) =>
        (df as any).dataAgreementName ?? contractMap.get(Number(df.dataAgreement ?? '')) ?? df.dataAgreement ?? '-';

    return (
        <div className="min-h-full p-6">
            <div className="bg-[#07121a] rounded-md shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                    <div>
                        <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wider">Flujo de Datos</h2>
                        <p className="text-xs text-gray-500 mt-1">Listado de flujos de datos</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={() => openForm()} className="inline-flex items-center gap-2 px-3 py-2 bg-[#6b46c1] hover:bg-[#7b57d6] text-white rounded-md text-sm">
                            <Icon icon="mdi:plus" width="16" height="16" /> Agregar
                        </button>

                        <button onClick={() => navigate('/app/rat')} className="inline-flex items-center gap-2 px-3 py-2 bg-transparent border border-gray-800 text-gray-400 rounded-md text-sm">
                            <Icon icon="mdi:arrow-left" width="16" height="16" /> Volver
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
                                    <th className="px-8 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Registro de tratamiento</th>
                                    <th className="px-8 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Entidad</th>
                                    <th className="px-8 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Rol de entidad</th>
                                    <th className="px-8 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">País</th>
                                    <th className="px-8 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Entidad padre</th>
                                    <th className="px-8 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Acuerdo de datos</th>
                                    <th className="px-8 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {items.map((df) => (
                                    <tr key={df.id} className="border-b border-gray-800 last:border-b-0 hover:bg-[#08121a]">
                                        <td className="px-8 py-6 text-left">
                                            <div className="font-semibold text-gray-100">{getProcessingActivityDisplay(df)}</div>
                                        </td>

                                        <td className="px-8 py-6 text-center text-sm text-gray-300">{getEntityDisplay(df)}</td>

                                        <td className="px-8 py-6 text-center text-sm text-gray-300">{df.entityRole ?? '-'}</td>

                                        <td className="px-8 py-6 text-center text-sm text-gray-300">{getCountryDisplay(df)}</td>

                                        <td className="px-8 py-6 text-center text-sm text-gray-300">{getParentEntityDisplay(df)}</td>

                                        <td className="px-8 py-6 text-center text-sm text-gray-300 whitespace-pre-wrap">{getDataAgreementDisplay(df)}</td>

                                        <td className="px-8 py-6 text-right">
                                            <div className="inline-flex items-center gap-3 justify-end">
                                                <button onClick={() => openForm(df)} title="Editar" className="p-1 rounded hover:bg-transparent">
                                                    <Icon icon="mdi:pencil" width="18" height="18" className="text-[#9f7aea]" />
                                                </button>
                                                <button onClick={() => console.log('Eliminar', df.id)} title="Eliminar" className="p-1 rounded hover:bg-transparent">
                                                    <Icon icon="mdi:trash-can-outline" width="18" height="18" className="text-[#ff6b6b]" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-8 py-8 text-center text-gray-500">No se encontraron flujos de datos.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal */}
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
                                    <label className="block text-xs text-gray-400 mb-1">Registro de tratamiento</label>
                                    <input name="processingActivityId" type="number" min={1} value={form.processingActivityId ?? ''} onChange={handleChange} className="w-full px-3 py-2 rounded bg-[#06101a] text-gray-200 border border-gray-800" />
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Entidad</label>
                                    <select name="entityId" value={form.entityId ?? ''} onChange={handleChange} className="w-full px-3 py-2 rounded bg-[#06101a] text-gray-200 border border-gray-800">
                                        <option value="">-- Seleccionar --</option>
                                        {(entities ?? []).map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Rol de entidad</label>
                                <select name="entityRole" value={form.entityRole} onChange={handleChange} required className="w-full px-3 py-2 rounded bg-[#06101a] text-gray-200 border border-gray-800">
                                    <option value="">-- Seleccionar --</option>
                                    {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">País</label>
                                    <select name="country" value={form.country ?? ''} onChange={handleChange} className="w-full px-3 py-2 rounded bg-[#06101a] text-gray-200 border border-gray-800">
                                        <option value="">-- Seleccionar --</option>
                                        {(countries ?? []).map((c) => <option key={String(c.id)} value={String(c.id)}>{c.name}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Entidad Padre</label>
                                    <select name="parentEntity" value={form.parentEntity ?? ''} onChange={handleChange} className="w-full px-3 py-2 rounded bg-[#06101a] text-gray-200 border border-gray-800">
                                        <option value="">-- Seleccionar --</option>
                                        {(entities ?? []).map((e) => <option key={e.id} value={String(e.id)}>{e.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Acuerdo de datos</label>
                                <select name="dataAgreement" value={form.dataAgreement ?? ''} onChange={handleChange} className="w-full px-3 py-2 rounded bg-[#06101a] text-gray-200 border border-gray-800">
                                    <option value="">-- Seleccionar --</option>
                                    {(contracts ?? []).map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                                </select>
                            </div>

                            {formError && <div className="text-sm text-red-500">{formError}</div>}

                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setShowForm(false)} className="px-3 py-2 bg-transparent border border-gray-800 text-gray-400 rounded">Cancelar</button>
                                <button type="submit" disabled={saving} className="px-4 py-2 bg-[#6b46c1] text-white rounded">{saving ? 'Guardando...' : 'Guardar'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}