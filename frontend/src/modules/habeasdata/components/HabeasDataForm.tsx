import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useCreateDsr, useUpdateDsr, useRequestTypes } from '../hooks/useHabeasData';
import type { Dsr, CreateDsrDto } from '../types';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import { useUserStore } from '../../../stores/userStore';
import { usePermissions } from '../../../hooks/usePermissions';

interface HabeasDataFormProps {
    dsr: Dsr | null;
    onClose: () => void;
}

export default function HabeasDataForm({ dsr, onClose }: HabeasDataFormProps) {
    const createDsr = useCreateDsr();
    const updateDsr = useUpdateDsr();
    const { data: requestTypes, isLoading: isLoadingTypes } = useRequestTypes();
    const isEditing = !!dsr;
    const { userData } = useUserStore();
    const { isSuperAdmin } = usePermissions();

    const [formData, setFormData] = useState<{
        caseId: string;
        requestId: string;
        type: number;
        category: string;
        fullName: string;
        idType: string;
        idNumber: string;
        email: string;
        requestDetails: string;
        attachment: string;
        startDate: string;
        responseAttachment: boolean;
        createdBy: string | undefined;
    }>({
        caseId: '',
        requestId: '',
        type: 0,
        category: '',
        fullName: '',
        idType: '',
        idNumber: '',
        email: '',
        requestDetails: '',
        attachment: '',
        startDate: new Date().toISOString().split('T')[0],
        responseAttachment: false,
        createdBy: undefined,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (dsr) {
            setFormData({
                caseId: dsr.caseId,
                requestId: dsr.requestId,
                type: dsr.type,
                category: dsr.category,
                fullName: dsr.fullName,
                idType: dsr.idType,
                idNumber: dsr.idNumber,
                email: dsr.email,
                requestDetails: dsr.requestDetails,
                attachment: dsr.attachment || '',
                startDate: new Date(dsr.startDate).toISOString().split('T')[0],
                responseAttachment: dsr.responseAttachment,
                createdBy: dsr.createdBy,
            });
        }
    }, [dsr]);

    // Actualizar categoría cuando cambia el tipo
    useEffect(() => {
        if (formData.type && requestTypes) {
            const selectedType = requestTypes.find(t => t.id === formData.type);
            if (selectedType?.category) {
                setFormData(prev => ({
                    ...prev,
                    category: selectedType.category || ''
                }));
            }
        }
    }, [formData.type, requestTypes]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'type' ? parseInt(value) || 0 : value
            }));
        }
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.caseId.trim()) newErrors.caseId = 'Requerido';
        if (!formData.requestId.trim()) newErrors.requestId = 'Requerido';
        if (!formData.type || formData.type < 1) newErrors.type = 'Requerido';
        if (!formData.fullName.trim()) newErrors.fullName = 'Requerido';
        if (!formData.idType.trim()) newErrors.idType = 'Requerido';
        if (!formData.idNumber.trim()) newErrors.idNumber = 'Requerido';
        if (!formData.email.trim()) newErrors.email = 'Requerido';
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }
        if (!formData.requestDetails.trim()) newErrors.requestDetails = 'Requerido';
        if (!formData.startDate) newErrors.startDate = 'Requerido';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const payload: CreateDsrDto = {
                caseId: formData.caseId,
                requestId: formData.requestId,
                type: formData.type,
                category: formData.category,
                fullName: formData.fullName,
                idType: formData.idType,
                idNumber: formData.idNumber,
                email: formData.email,
                requestDetails: formData.requestDetails,
                attachment: formData.attachment || undefined,
                startDate: new Date(formData.startDate),
                responseAttachment: formData.responseAttachment,
                createdBy: isEditing ? formData.createdBy : (isSuperAdmin ? undefined : userData?.nombreEmpresa),
            };

            if (isEditing && dsr) {
                await updateDsr.mutateAsync({ id: dsr.id, ...payload });
            } else {
                await createDsr.mutateAsync(payload);
            }
            onClose();
        } catch (error) {
            console.error('Error al guardar solicitud DSR:', error);
            alert('Error al guardar la solicitud');
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

    const isPending = createDsr.isPending || updateDsr.isPending;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white dark:bg-[#151824] rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                            <Icon icon={isEditing ? "mdi:pencil" : "mdi:plus"} width="24" height="24" className="text-purple-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                {isEditing ? 'Editar Solicitud DSR' : 'Nueva Solicitud DSR'}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {isEditing ? 'Modifica los datos de la solicitud' : 'Registra una nueva solicitud de datos'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Icon icon="mdi:close" width="24" height="24" className="text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} id="habeasdata-form" className="space-y-4">
                        {/* Fila 1: Case ID, Request ID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">ID Caso *</label>
                                <input 
                                    type="text" 
                                    name="caseId" 
                                    value={formData.caseId} 
                                    onChange={handleChange} 
                                    className={inputClass('caseId')} 
                                    placeholder="Ej: CASE-2026-001"
                                />
                                {errors.caseId && <span className="text-xs text-red-500">{errors.caseId}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">ID Solicitud *</label>
                                <input 
                                    type="text" 
                                    name="requestId" 
                                    value={formData.requestId} 
                                    onChange={handleChange} 
                                    className={inputClass('requestId')} 
                                    placeholder="Ej: REQ-2026-001"
                                />
                                {errors.requestId && <span className="text-xs text-red-500">{errors.requestId}</span>}
                            </div>
                        </div>

                        {/* Fila 2: Tipo y Categoría */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Solicitud *</label>
                                <select 
                                    name="type" 
                                    value={formData.type} 
                                    onChange={handleChange} 
                                    className={inputClass('type')}
                                    disabled={isLoadingTypes}
                                >
                                    <option value={0}>Seleccionar tipo...</option>
                                    {requestTypes?.map(type => (
                                        <option key={type.id} value={type.id}>
                                            {type.type}
                                        </option>
                                    ))}
                                </select>
                                {errors.type && <span className="text-xs text-red-500">{errors.type}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoría</label>
                                <input 
                                    type="text" 
                                    name="category" 
                                    value={formData.category} 
                                    onChange={handleChange} 
                                    className={inputClass('category')} 
                                    placeholder="Se llena automáticamente según el tipo"
                                    readOnly
                                />
                            </div>
                        </div>

                        {/* Fila 3: Nombre completo */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Completo *</label>
                            <input 
                                type="text" 
                                name="fullName" 
                                value={formData.fullName} 
                                onChange={handleChange} 
                                className={inputClass('fullName')} 
                                placeholder="Nombre completo del solicitante"
                            />
                            {errors.fullName && <span className="text-xs text-red-500">{errors.fullName}</span>}
                        </div>

                        {/* Fila 4: Tipo ID, Número ID, Email */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de ID *</label>
                                <select 
                                    name="idType" 
                                    value={formData.idType} 
                                    onChange={handleChange} 
                                    className={inputClass('idType')}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="CC">Cédula de Ciudadanía</option>
                                    <option value="CE">Cédula de Extranjería</option>
                                    <option value="NIT">NIT</option>
                                    <option value="PA">Pasaporte</option>
                                    <option value="TI">Tarjeta de Identidad</option>
                                </select>
                                {errors.idType && <span className="text-xs text-red-500">{errors.idType}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Número de ID *</label>
                                <input 
                                    type="text" 
                                    name="idNumber" 
                                    value={formData.idNumber} 
                                    onChange={handleChange} 
                                    className={inputClass('idNumber')} 
                                    placeholder="Número de identificación"
                                />
                                {errors.idNumber && <span className="text-xs text-red-500">{errors.idNumber}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    className={inputClass('email')} 
                                    placeholder="correo@ejemplo.com"
                                />
                                {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                            </div>
                        </div>

                        {/* Fila 5: Fecha de inicio */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Inicio *</label>
                                <input 
                                    type="date" 
                                    name="startDate" 
                                    value={formData.startDate} 
                                    onChange={handleChange} 
                                    className={inputClass('startDate')} 
                                />
                                {errors.startDate && <span className="text-xs text-red-500">{errors.startDate}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Adjunto (URL)</label>
                                <input 
                                    type="url" 
                                    name="attachment" 
                                    value={formData.attachment} 
                                    onChange={handleChange} 
                                    className={inputClass('attachment')} 
                                    placeholder="https://ejemplo.com/documento.pdf"
                                />
                            </div>
                        </div>

                        {/* Fila 6: Detalles de la solicitud */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Detalles de la Solicitud *</label>
                            <textarea 
                                name="requestDetails" 
                                rows={4} 
                                value={formData.requestDetails} 
                                onChange={handleChange} 
                                className={`${inputClass('requestDetails')} !h-auto py-2`} 
                                placeholder="Describa los detalles de la solicitud..."
                            />
                            {errors.requestDetails && <span className="text-xs text-red-500">{errors.requestDetails}</span>}
                        </div>

                        {/* Checkbox */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="responseAttachment"
                                checked={formData.responseAttachment}
                                onChange={handleChange}
                                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Requiere adjunto en respuesta
                            </label>
                        </div>

                        {/* Info de campos automáticos */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Icon icon="mdi:information" width="20" height="20" className="text-blue-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Campos calculados automáticamente
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Los siguientes campos serán calculados por el sistema: Fecha de creación, Fecha de vencimiento, 
                                Plazo inicial, Extensión del plazo, Plazo total.
                            </p>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        disabled={isPending} 
                        className="flex-1 h-[40px] bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        form="habeasdata-form" 
                        disabled={isPending} 
                        className="flex-1 h-[40px] bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 flex items-center justify-center"
                    >
                        {isPending ? <LoadingSpinner size="small" /> : isEditing ? 'Actualizar' : 'Crear'}
                    </button>
                </div>
            </div>
        </div>
    );
}