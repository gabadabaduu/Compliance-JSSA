import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import {
    useCreateRopaTable,
    useUpdateRopaTable,
    useRopaSystems,
    useRopaDataTypes,
    useRopaSubjectCategories,
    useRopaPurposes,
    useRopaStorageLookup,
    useRopaDataFlow,
    useRopaDepartments,
} from '../hooks/useRat';
import type { RopaTable, CreateRopaTableDto } from '../types';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import { useUserStore } from '../../../../stores/userStore';

interface RopaTableFormProps {
    record: RopaTable | null;
    onClose: () => void;
}

export default function RopaTableForm({ record, onClose }: RopaTableFormProps) {
    const createRecord = useCreateRopaTable();
    const updateRecord = useUpdateRopaTable();
    const isEditing = !!record;
    const { userData } = useUserStore();

    // Lookups
    const { data: systems, isLoading: loadingSystems } = useRopaSystems();
    const { data: dataTypes, isLoading: loadingDataTypes } = useRopaDataTypes();
    const { data: subjectCategories, isLoading: loadingSubjectCat } = useRopaSubjectCategories();
    const { data: purposes, isLoading: loadingPurposes } = useRopaPurposes();
    const { data: storage, isLoading: loadingStorage } = useRopaStorageLookup();
    const { data: dataFlow, isLoading: loadingDataFlow } = useRopaDataFlow();
    const { data: departments, isLoading: loadingDepartments } = useRopaDepartments();

    const isLoadingLookups = loadingSystems || loadingDataTypes || loadingSubjectCat ||
        loadingPurposes || loadingStorage || loadingDataFlow || loadingDepartments;

    const [formData, setFormData] = useState({
        processingActivity: '',
        captureMethod: '',
        systemId: 0,
        dataSource: '',
        dataTypesId: 0,
        dataCategories: '',
        subjectCategoriesId: 0,
        purposesId: 0,
        purposeDescription: '',
        storageId: 0,
        dataShared: '',
        recipientsId: 0,
        retentionPeriod: '',
        processOwner: 0,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (record) {
            setFormData({
                processingActivity: record.processingActivity ?? '',
                captureMethod: record.captureMethod ?? '',
                systemId: record.systemId ?? 0,
                dataSource: record.dataSource ?? '',
                dataTypesId: record.dataTypesId ?? 0,
                dataCategories: record.dataCategories ?? '',
                subjectCategoriesId: record.subjectCategoriesId ?? 0,
                purposesId: record.purposesId ?? 0,
                purposeDescription: record.purposeDescription ?? '',
                storageId: record.storageId ?? 0,
                dataShared: record.dataShared ?? '',
                recipientsId: record.recipientsId ?? 0,
                retentionPeriod: record.retentionPeriod ?? '',
                processOwner: record.processOwner ?? 0,
            });
        }
    }, [record]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const numericFields = ['systemId', 'dataTypesId', 'subjectCategoriesId', 'purposesId', 'storageId', 'recipientsId', 'processOwner'];

        setFormData(prev => ({
            ...prev,
            [name]: numericFields.includes(name) ? (value === '' ? 0 : Number(value)) : value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.processingActivity.trim()) newErrors.processingActivity = 'Requerido';
        if (!formData.captureMethod.trim()) newErrors.captureMethod = 'Requerido';
        if (!formData.retentionPeriod.trim()) newErrors.retentionPeriod = 'Requerido';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const payload: CreateRopaTableDto = {
                processingActivity: formData.processingActivity,
                captureMethod: formData.captureMethod,
                systemId: formData.systemId || null,
                dataSource: formData.dataSource || null,
                dataTypesId: formData.dataTypesId || null,
                dataCategories: formData.dataCategories || null,
                subjectCategoriesId: formData.subjectCategoriesId || null,
                purposesId: formData.purposesId || null,
                purposeDescription: formData.purposeDescription || null,
                storageId: formData.storageId || null,
                dataShared: formData.dataShared || null,
                recipientsId: formData.recipientsId || null,
                retentionPeriod: formData.retentionPeriod,
                processOwner: formData.processOwner || null,
                tenant: userData?.nombreEmpresa,
                createdBy: isEditing ? record?.createdBy : userData?.id,
                updatedBy: isEditing ? userData?.id : undefined,
            };

            // Debug: ver payload en consola (quitar en producción)
            console.log('RopaTable payload ->', isEditing ? { id: record?.id, ...payload } : payload);

            if (isEditing && record?.id != null) {
                // Asegurar que id existe antes de llamar update
                await updateRecord.mutateAsync({ id: record.id, ...payload });
            } else {
                await createRecord.mutateAsync(payload);
            }
            onClose();
        } catch (error) {
            console.error('Error al guardar registro:', error);
            alert('Error al guardar el registro');
        }
    };

    const inputClass = (field: string) => `
        w-full h-[40px] px-4 rounded-lg border 
        ${errors[field] ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'}
        bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
        placeholder-gray-400 dark:placeholder-gray-500 
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
        transition-colors
    `;

    const isPending = createRecord.isPending || updateRecord.isPending;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white dark:bg-[#151824] rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                            <Icon icon={isEditing ? "mdi:pencil" : "mdi:plus"} width="24" height="24" className="text-purple-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                {isEditing ? 'Editar Registro' : 'Nuevo Registro de Tratamiento'}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {isEditing ? 'Modifica los datos del registro' : 'Registra una nueva actividad de tratamiento'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Icon icon="mdi:close" width="24" height="24" className="text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto p-6">
                    {isLoadingLookups ? (
                        <div className="flex items-center justify-center py-12">
                            <LoadingSpinner size="large" text="Cargando datos..." />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} id="ropa-table-form" className="space-y-4">
                            {/* Fila 1: Actividad + Método de Captura */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Actividad de Tratamiento *</label>
                                    <input
                                        type="text"
                                        name="processingActivity"
                                        value={formData.processingActivity}
                                        onChange={handleChange}
                                        className={inputClass('processingActivity')}
                                        placeholder="Ej: Gestión de nómina"
                                    />
                                    {errors.processingActivity && <span className="text-xs text-red-500">{errors.processingActivity}</span>}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Método de Captura *</label>
                                    <select name="captureMethod" value={formData.captureMethod} onChange={handleChange} className={inputClass('captureMethod')}>
                                        <option value="">Seleccionar...</option>
                                        <option value="Formulario">Formulario</option>
                                        <option value="Correo electrónico">Correo electrónico</option>
                                        <option value="Presencial">Presencial</option>
                                        <option value="Web">Web</option>
                                        <option value="App móvil">App móvil</option>
                                        <option value="Tercero">Tercero</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                    {errors.captureMethod && <span className="text-xs text-red-500">{errors.captureMethod}</span>}
                                </div>
                            </div>

                            {/* Fila 2: Sistema + Fuente de Datos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sistema</label>
                                    <select name="systemId" value={formData.systemId} onChange={handleChange} className={inputClass('systemId')}>
                                        <option value={0}>Seleccionar...</option>

                                        {/* Si el registro tiene un systemId que no está en systems, mostrarlo como opción guardada */}
                                        {record?.systemId && systems && !systems.some(s => s.id === record.systemId) && (
                                            <option value={record.systemId}>
                                                {`(Guardado) ID ${record.systemId}`}
                                            </option>
                                        )}

                                        {/* Rellenar con las opciones del catálogo */}
                                        {systems?.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fuente de Datos</label>
                                    <select name="dataSource" value={formData.dataSource} onChange={handleChange} className={inputClass('dataSource')}>
                                        <option value="">Seleccionar...</option>
                                        <option value="Titular">Titular</option>
                                        <option value="Tercero">Tercero</option>
                                        <option value="Fuente pública">Fuente pública</option>
                                        <option value="Transferencia">Transferencia</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>
                            </div>

                            {/* Fila 3: Tipo de Dato + Categoría de Dato */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Dato</label>
                                    <select name="dataTypesId" value={formData.dataTypesId} onChange={handleChange} className={inputClass('dataTypesId')}>
                                        <option value={0}>Seleccionar...</option>
                                        {dataTypes?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoría de Dato</label>
                                    <select name="dataCategories" value={formData.dataCategories} onChange={handleChange} className={inputClass('dataCategories')}>
                                        <option value="">Seleccionar...</option>
                                        <option value="Potenciales Clientes">Potenciales Clientes</option>
                                        <option value="Clientes">Clientes</option>
                                        <option value="Proveedores">Proveedores</option>
                                        <option value="Sensible">Sensible</option>
                                    </select>
                                </div>
                            </div>

                            {/* Fila 4: Categoría de Titular + Finalidad */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoría de Titular</label>
                                    <select name="subjectCategoriesId" value={formData.subjectCategoriesId} onChange={handleChange} className={inputClass('subjectCategoriesId')}>
                                        <option value={0}>Seleccionar...</option>
                                        {subjectCategories?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Finalidad</label>
                                    <select name="purposesId" value={formData.purposesId} onChange={handleChange} className={inputClass('purposesId')}>
                                        <option value={0}>Seleccionar...</option>
                                        {purposes?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Fila 5: Descripción Finalidad */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción de la Finalidad</label>
                                <textarea
                                    name="purposeDescription"
                                    rows={2}
                                    value={formData.purposeDescription}
                                    onChange={handleChange}
                                    className={`${inputClass('purposeDescription')} !h-auto py-2`}
                                    placeholder="Describe la finalidad del tratamiento..."
                                />
                            </div>

                            {/* Fila 6: Almacenamiento + Dato Compartido */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Almacenamiento</label>
                                    <select name="storageId" value={formData.storageId} onChange={handleChange} className={inputClass('storageId')}>
                                        <option value={0}>Seleccionar...</option>
                                        {storage?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dato Compartido</label>
                                    <select name="dataShared" value={formData.dataShared} onChange={handleChange} className={inputClass('dataShared')}>
                                        <option value="">Seleccionar...</option>
                                        <option value="Sí">Sí</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                            </div>

                            {/* Fila 7: Destinatarios + Período de Retención */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Destinatarios</label>
                                    <select name="recipientsId" value={formData.recipientsId} onChange={handleChange} className={inputClass('recipientsId')}>
                                        <option value={0}>Seleccionar...</option>
                                        {dataFlow?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Período de Retención *</label>
                                    <input
                                        type="text"
                                        name="retentionPeriod"
                                        value={formData.retentionPeriod}
                                        onChange={handleChange}
                                        className={inputClass('retentionPeriod')}
                                        placeholder="Ej: 5 años después de la relación"
                                    />
                                    {errors.retentionPeriod && <span className="text-xs text-red-500">{errors.retentionPeriod}</span>}
                                </div>
                            </div>

                            {/* Fila 8: Responsable */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Responsable del Proceso</label>
                                    <select name="processOwner" value={formData.processOwner} onChange={handleChange} className={inputClass('processOwner')}>
                                        <option value={0}>Seleccionar...</option>
                                        {departments?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="flex-1 h-[40px] bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="ropa-table-form"
                        disabled={isPending || isLoadingLookups}
                        className="flex-1 h-[40px] bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                    >
                        {isPending ? (
                            <LoadingSpinner size="small" />
                        ) : (
                            <>
                                <Icon icon={isEditing ? "mdi:content-save" : "mdi:plus"} width="20" height="20" />
                                {isEditing ? 'Actualizar' : 'Crear Registro'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}