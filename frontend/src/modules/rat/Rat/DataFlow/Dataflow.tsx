import React, { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    useRopaDataFlows,
    useCreateRopaDataFlow,
    useUpdateRopaDataFlow,
    useDeleteRopaDataFlow,
    useRopaEntities,
    useRopaContracts,
} from '../hooks/useRat';
import COUNTRIES from '../../../../constants/countries';
import FlowDiagram from './FlowDiagram';
import type { RopaDataFlowDto, CreateRopaDataFlowDto } from '../services/ratService';

const ROLE_OPTIONS = ['Responsable', 'Área Interna', 'Encargado', 'Subencargado'];

export default function Dataflow() {
    const navigate = useNavigate();
    const location = useLocation();

    const { data: dataflows, isLoading, error } = useRopaDataFlows();
    const createMutation = useCreateRopaDataFlow();
    const updateMutation = useUpdateRopaDataFlow();
    const deleteMutation = useDeleteRopaDataFlow();

    const { data: entities } = useRopaEntities();

    // ✅ FIX: traemos también loading + error de contratos
    const {
        data: contracts,
        isLoading: contractsLoading,
        error: contractsError,
    } = useRopaContracts();

    const countries = COUNTRIES;

    // theme detection (light/dark) — reads root .dark class
    const [isDark, setIsDark] = useState<boolean>(
        typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : true
    );
    useEffect(() => {
        const root = document.documentElement;
        const mo = new MutationObserver(() => setIsDark(root.classList.contains('dark')));
        mo.observe(root, { attributes: true, attributeFilter: ['class'] });
        return () => mo.disconnect();
    }, []);

    // --- Shared UI classes (light/dark) ---
    const inputBase = 'w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 transition-colors';
    const inputClass = isDark
        ? `${inputBase} bg-[#06101a] text-gray-200 border-gray-800 focus:ring-[#6b46c1]/40`
        : `${inputBase} bg-white text-slate-900 border-slate-300 focus:ring-[#6b46c1]/30`;

    const readonlyClass = isDark
        ? 'w-full px-3 py-2 rounded bg-[#06101a] text-gray-200 border border-gray-800'
        : 'w-full px-3 py-2 rounded bg-slate-50 text-slate-900 border border-slate-300';

    const labelClass = isDark ? 'block text-xs text-gray-400 mb-1' : 'block text-xs text-slate-600 mb-1';
    const modalTitleClass = isDark ? 'text-lg font-semibold text-[#e6eef6]' : 'text-lg font-semibold text-slate-900';
    const closeBtnClass = isDark ? 'text-gray-400 hover:text-gray-200' : 'text-slate-400 hover:text-slate-600';
    const cancelBtnClass = isDark
        ? 'px-3 py-2 bg-transparent border border-gray-800 text-gray-300 rounded'
        : 'px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50';

    // safe arrays for TS
    const safeEntities = (entities ?? []) as any[];
    const safeContracts = (contracts ?? []) as any[];
    const safeCountries = (countries ?? []) as any[];

    const entityMap = useMemo(() => {
        const m = new Map<number, string>();
        safeEntities.forEach((e: any) => m.set(Number(e.id), e.name));
        return m;
    }, [safeEntities]);

    const contractMap = useMemo(() => {
        const m = new Map<number, string>();
        safeContracts.forEach((c: any) => m.set(Number(c.id), c.name));
        return m;
    }, [safeContracts]);

    const countryMap = useMemo(() => {
        const m = new Map<string, string>();
        safeCountries.forEach((c: any) => m.set(String(c.id), c.name));
        return m;
    }, [safeCountries]);

    const items: RopaDataFlowDto[] = dataflows ?? [];
    const errorMessage = (error as Error)?.message ?? 'Error desconocido';

    // form/modal state
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<RopaDataFlowDto | null>(null);

    const [form, setForm] = useState<CreateRopaDataFlowDto>({
        processingActivityId: undefined,
        entityId: undefined,
        entityRole: '',
        country: '',
        parentEntity: '',
        dataAgreement: '',
    });
    const [formError, setFormError] = useState<string | null>(null);

    // fixed processing activity when navigated from ROPA form
    const [fixedProcessingActivityId, setFixedProcessingActivityId] = useState<number | null>(null);
    const [fixedProcessingActivityName, setFixedProcessingActivityName] = useState<string | null>(null);

    // Read incoming state/query param and prefill + open modal if present
    useEffect(() => {
        const stateAny = (location.state ?? {}) as any;
        const fromState = stateAny.processingActivityId ?? stateAny.processing_activity_id;
        const fromName = stateAny.processingActivityName ?? stateAny.processing_activity_name ?? null;

        if (fromState) {
            const idNum = Number(fromState);
            if (!Number.isNaN(idNum)) {
                setFixedProcessingActivityId(idNum);
                if (fromName) setFixedProcessingActivityName(String(fromName));
                setForm((s) => ({ ...s, processingActivityId: idNum }));
                setEditingItem(null);
                setShowForm(true);
                return;
            }
        }

        try {
            const searchParams = new URLSearchParams(location.search);
            const q = searchParams.get('processingActivityId') ?? searchParams.get('processing_activity_id');
            if (q) {
                const idNum = Number(q);
                if (!Number.isNaN(idNum)) {
                    setFixedProcessingActivityId(idNum);
                    setForm((s) => ({ ...s, processingActivityId: idNum }));
                    setEditingItem(null);
                    setShowForm(true);
                }
            }
        } catch {
            // noop
        }
    }, [location]);

    // Robust filteredItems: compare via String to avoid number/string mismatch
    const filteredItems = useMemo(() => {
        if (fixedProcessingActivityId != null) {
            const key = String(fixedProcessingActivityId);
            return items.filter((f) => {
                const pid = (f as any).processingActivityId ?? (f as any).processing_activity_id ?? (f as any).processingActivity;
                return String(pid) === key;
            });
        }
        return items;
    }, [items, fixedProcessingActivityId]);

    // entities for diagram
    const entitiesForDiagram = useMemo(() => {
        const map = new Map<string, { id: number; name: string; country?: string; role?: string }>();

        filteredItems.forEach((f) => {
            const entityId = (f as any).entityId ?? (f as any).entity_id ?? null;
            const parentEntity = (f as any).parentEntity ?? (f as any).parent_entity ?? null;

            if (entityId != null && String(entityId) !== '') {
                const idNum = Number(entityId);
                const name = (f as any).entityName ?? entityMap.get(idNum) ?? String(entityId);

                const country = (f as any).countryName ?? countryMap.get(String((f as any).country ?? '')) ?? undefined;
                const role = (f as any).entityRole ?? undefined;

                map.set(String(entityId), { id: idNum, name, country, role });
            }

            if (parentEntity != null && String(parentEntity) !== '') {
                const idNum = Number(parentEntity);
                const name = (f as any).parentEntityName ?? entityMap.get(idNum) ?? String(parentEntity);

                if (!map.has(String(parentEntity))) {
                    map.set(String(parentEntity), { id: idNum, name });
                }
            }
        });

        return Array.from(map.values());
    }, [filteredItems, entityMap, countryMap]);

    const openForm = (item?: RopaDataFlowDto) => {
        if (item) {
            setEditingItem(item);
            setForm({
                processingActivityId: item.processingActivityId ?? undefined,
                entityId: item.entityId ?? undefined,
                entityRole: item.entityRole ?? '',
                country: item.country ?? '',
                parentEntity: item.parentEntity ?? '',
                dataAgreement: item.dataAgreement ?? '',
            });
            if (item.processingActivityId) setFixedProcessingActivityId(item.processingActivityId);
        } else {
            setEditingItem(null);
            setForm({
                processingActivityId: fixedProcessingActivityId ?? undefined,
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

        if (name === 'processingActivityId' && fixedProcessingActivityId != null) return;

        if (name === 'processingActivityId' || name === 'entityId') {
            setForm((s) => ({ ...s, [name]: value === '' ? undefined : Number(value) } as any));
            return;
        }

        setForm((s) => ({ ...s, [name]: value } as any));
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setFormError(null);

        if (!form.entityRole || form.entityRole.trim() === '') {
            setFormError('El rol de la entidad es obligatorio.');
            return;
        }

        const processingId = fixedProcessingActivityId ?? form.processingActivityId;
        const payload: CreateRopaDataFlowDto = {
            processingActivityId: processingId && processingId > 0 ? processingId : undefined,
            entityId: form.entityId && form.entityId > 0 ? form.entityId : undefined,
            entityRole: form.entityRole?.trim() ?? '',
            country: form.country?.trim() ?? '',
            parentEntity: form.parentEntity?.trim() ?? '',
            dataAgreement: form.dataAgreement?.trim() ?? '',
        };

        try {
            if (editingItem) {
                await updateMutation.mutateAsync({ ...(payload as any), id: editingItem.id } as RopaDataFlowDto);
            } else {
                await createMutation.mutateAsync(payload);
            }
            setShowForm(false);
            setEditingItem(null);
            setForm({
                processingActivityId: fixedProcessingActivityId ?? undefined,
                entityId: undefined,
                entityRole: '',
                country: '',
                parentEntity: '',
                dataAgreement: '',
            });
        } catch (err) {
            setFormError((err as Error)?.message ?? 'Error al guardar registro');
        }
    };

    const saving = createMutation.status === 'pending' || updateMutation.status === 'pending';
    const deleting = deleteMutation.status === 'pending';

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

    const handleDelete = async (id: number) => {
        if (!confirm('¿Eliminar este flujo de datos? Esta acción no se puede deshacer.')) return;
        try {
            await deleteMutation.mutateAsync(id);
        } catch (err) {
            console.error('Error eliminando', err);
            alert((err as Error)?.message ?? 'Error al eliminar');
        }
    };

    // colors for panel/table adapted to theme
    const panelBg = isDark ? '#07121a' : '#ffffff';
    const outerBg = isDark ? '#06121a' : '#f8fafc';
    const textColor = isDark ? '#e6eef6' : '#0f172a';
    const subTextColor = isDark ? '#94a3b8' : '#6b7280';

    return (
        <div className="min-h-full p-6" style={{ background: outerBg }}>
            <div style={{ background: panelBg }} className="rounded-md shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: isDark ? '#0f1724' : '#e6eef6' }}>
                    <div>
                        <h2 className="text-sm font-medium uppercase tracking-wider" style={{ color: textColor }}>Flujo de Datos</h2>
                        <p className="text-xs mt-1" style={{ color: subTextColor }}>
                            {fixedProcessingActivityId ? `Flujos para actividad ${fixedProcessingActivityName ?? `#${fixedProcessingActivityId}`}` : 'Listado de flujos de datos'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={() => openForm()} className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm" style={{ background: '#6b46c1', color: '#fff' }}>
                            <Icon icon="mdi:plus" width="16" height="16" /> {fixedProcessingActivityId ? 'Agregar flujo a esta actividad' : 'Agregar'}
                        </button>

                        <button onClick={() => navigate('/app/rat')} className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm" style={{ background: isDark ? '#07121a' : 'transparent', color: subTextColor, border: `1px solid ${isDark ? '#0f1724' : '#e6eef6'}` }}>
                            <Icon icon="mdi:arrow-left" width="16" height="16" /> Volver
                        </button>
                    </div>
                </div>

                {/* Tabla */}
                <div className="overflow-auto">
                    {isLoading ? (
                        <div className="p-6 text-center" style={{ color: subTextColor }}>Cargando flujos de datos...</div>
                    ) : error ? (
                        <div className="p-6 text-center" style={{ color: '#ff6b6b' }}>Error al cargar flujos: {errorMessage}</div>
                    ) : (
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr style={{ borderBottom: `1px solid ${isDark ? '#0f1724' : '#e6eef6'}` }}>
                                    <th className="px-8 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: subTextColor }}>Registro de tratamiento</th>
                                    <th className="px-8 py-4 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: subTextColor }}>Entidad</th>
                                    <th className="px-8 py-4 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: subTextColor }}>Rol de entidad</th>
                                    <th className="px-8 py-4 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: subTextColor }}>País</th>
                                    <th className="px-8 py-4 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: subTextColor }}>Entidad padre</th>
                                    <th className="px-8 py-4 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: subTextColor }}>Acuerdo de datos</th>
                                    <th className="px-8 py-4 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: subTextColor }}>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredItems.map((df) => (
                                    <tr key={df.id} style={{ borderBottom: `1px solid ${isDark ? '#0f1724' : '#eef2f6'}` }}>
                                        <td className="px-8 py-6 text-left">
                                            <div className="font-semibold" style={{ color: textColor }}>{getProcessingActivityDisplay(df)}</div>
                                        </td>

                                        <td className="px-8 py-6 text-center text-sm" style={{ color: isDark ? '#cfe7ff' : '#0f172a' }}>{getEntityDisplay(df)}</td>

                                        <td className="px-8 py-6 text-center text-sm" style={{ color: isDark ? '#cfe7ff' : '#0f172a' }}>{df.entityRole ?? '-'}</td>

                                        <td className="px-8 py-6 text-center text-sm" style={{ color: isDark ? '#cfe7ff' : '#0f172a' }}>{getCountryDisplay(df)}</td>

                                        <td className="px-8 py-6 text-center text-sm" style={{ color: isDark ? '#cfe7ff' : '#0f172a' }}>{getParentEntityDisplay(df)}</td>

                                        <td className="px-8 py-6 text-center text-sm whitespace-pre-wrap" style={{ color: isDark ? '#cfe7ff' : '#0f172a' }}>{getDataAgreementDisplay(df)}</td>

                                        <td className="px-8 py-6 text-right">
                                            <div className="inline-flex items-center gap-3 justify-end">
                                                <button
                                                    onClick={() => openForm(df)}
                                                    title="Editar"
                                                    className="p-1 rounded"
                                                    style={{ color: '#9f7aea' }}
                                                    disabled={saving || deleting}
                                                >
                                                    <Icon icon="mdi:pencil" width="18" height="18" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(df.id)}
                                                    title="Eliminar"
                                                    className="p-1 rounded"
                                                    style={{ color: '#ff6b6b' }}
                                                    disabled={deleting}
                                                >
                                                    <Icon icon="mdi:trash-can-outline" width="18" height="18" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredItems.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-8 py-8 text-center" style={{ color: subTextColor }}>
                                            {fixedProcessingActivityId ? 'No hay flujos para esta actividad.' : 'No se encontraron flujos de datos.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* ----- Espacio + panel blanco/oscuro con diagrama ----- */}
                {fixedProcessingActivityId != null && (
                    <div className="mt-12 px-4">
                        <div style={{ background: isDark ? '#07121a' : '#fff' }} className="rounded-lg shadow-lg p-6">
                            <div className="mb-4">
                                <h3 style={{ color: isDark ? '#e6eef6' : '#0f172a' }} className="text-sm font-semibold">Mapa de flujo</h3>
                                <p style={{ color: isDark ? '#94a3b8' : '#6b7280' }} className="text-xs">Vista gráfica de los flujos asociados a la actividad</p>
                            </div>

                            <FlowDiagram
                                processingActivityId={fixedProcessingActivityId}
                                processingActivityName={fixedProcessingActivityName}
                                flows={filteredItems}
                                entities={entitiesForDiagram}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-2xl rounded-md p-6 border" style={{ background: isDark ? '#07121a' : '#fff' }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={modalTitleClass}>{editingItem ? 'Editar flujo de datos' : 'Agregar flujo de datos'}</h3>
                            <button onClick={() => { setShowForm(false); setEditingItem(null); }} className={closeBtnClass}>
                                <Icon icon="mdi:close" width="18" height="18" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Registro de tratamiento</label>

                                    {fixedProcessingActivityId ? (
                                        <div className={readonlyClass}>
                                            {fixedProcessingActivityName ?? `ID ${fixedProcessingActivityId}`}
                                        </div>
                                    ) : (
                                        <input
                                            name="processingActivityId"
                                            type="number"
                                            min={1}
                                            value={form.processingActivityId ?? ''}
                                            onChange={handleChange}
                                            className={inputClass}
                                        />
                                    )}
                                </div>

                                <div>
                                    <label className={labelClass}>Entidad</label>
                                    <select name="entityId" value={form.entityId ?? ''} onChange={handleChange} className={inputClass}>
                                        <option value="">-- Seleccionar --</option>
                                        {safeEntities.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Rol de entidad</label>
                                <select name="entityRole" value={form.entityRole} onChange={handleChange} required className={inputClass}>
                                    <option value="">-- Seleccionar --</option>
                                    {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>País</label>
                                    <select name="country" value={form.country ?? ''} onChange={handleChange} className={inputClass}>
                                        <option value="">-- Seleccionar --</option>
                                        {safeCountries.map((c: any) => <option key={String(c.id)} value={String(c.id)}>{c.name}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className={labelClass}>Entidad Padre</label>
                                    <select name="parentEntity" value={form.parentEntity ?? ''} onChange={handleChange} className={inputClass}>
                                        <option value="">Ninguno</option>
                                        {safeEntities.map((e: any) => <option key={e.id} value={String(e.id)}>{e.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* ✅ DROPDOWN CONTRATOS (CON LOADING / EMPTY / ERROR) */}
                            <div>
                                <label className={labelClass}>Acuerdo de datos</label>
                                <select name="dataAgreement" value={form.dataAgreement ?? ''} onChange={handleChange} className={inputClass}>
                                    <option value="">
                                        {contractsLoading ? 'Cargando contratos...' : '-- Seleccionar --'}
                                    </option>

                                    {!contractsLoading && safeContracts.length === 0 && (
                                        <option value="" disabled>
                                            No hay contratos disponibles
                                        </option>
                                    )}

                                    {safeContracts.map((c: any) => (
                                        <option key={c.id} value={String(c.id)}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>

                                {contractsError && (
                                    <div className="text-xs text-red-500 mt-1">
                                        Error cargando contratos: {(contractsError as Error).message}
                                    </div>
                                )}
                            </div>

                            {formError && <div className="text-sm text-red-500">{formError}</div>}

                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => { setShowForm(false); setEditingItem(null); }} className={cancelBtnClass}>
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