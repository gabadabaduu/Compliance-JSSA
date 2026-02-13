import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { useCreateContract, useUpdateContract, useEntities } from '../hooks/useContracts';
import type { RopaContract, CreateRopaContractDto } from '../types';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import { useUserStore } from '../../../../stores/userStore';
import { usePermissions } from '../../../../hooks/usePermissions';

// Constantes de validación
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_MIME = 'application/pdf';

interface ContractsFormProps {
    contract: RopaContract | null;
    onClose: () => void;
}

export default function ContractsForm({ contract, onClose }: ContractsFormProps) {
    const createContract = useCreateContract();
    const updateContract = useUpdateContract();
    const { data: entities, isLoading: isLoadingEntities } = useEntities();
    const isEditing = !!contract;
    const { userData } = useUserStore();
    const { isSuperAdmin } = usePermissions();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<{
        contractId: string;
        entityId: number;
        contractType: string;
        startDate: string;
        endDate: string;
        status: string;
        notes: string;
        attachment: string;
        attachmentFileName: string;
        createdBy: string | undefined;
        updatedBy: string | undefined;
    }>({
        contractId: '',
        entityId: 0,
        contractType: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        status: 'Vigente',
        notes: '',
        attachment: '',
        attachmentFileName: '',
        createdBy: undefined,
        updatedBy: undefined,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(null);

    useEffect(() => {
        if (contract) {
            setFormData({
                contractId: contract.contractId,
                entityId: contract.entityId,
                contractType: contract.contractType,
                startDate: new Date(contract.startDate).toISOString().split('T')[0],
                endDate: new Date(contract.endDate).toISOString().split('T')[0],
                status: contract.status,
                notes: contract.notes || '',
                attachment: contract.attachment || '',
                attachmentFileName: contract.attachmentFileName || '',
                createdBy: contract.createdBy,
                updatedBy: contract.updatedBy,
            });

            // Si ya tiene adjunto, mostrar info
            if (contract.attachment) {
                setFileInfo({
                    name: contract.attachmentFileName || 'documento.pdf',
                    size: formatFileSize(getBase64Size(contract.attachment)),
                });
            }
        }
    }, [contract]);

    // Calcular tamaño aproximado de un string base64
    const getBase64Size = (base64: string): number => {
        const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
        const padding = (cleanBase64.match(/=/g) || []).length;
        return Math.floor((cleanBase64.length * 3) / 4) - padding;
    };

    // Formatear tamaño de archivo
    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: name === 'entityId' ? parseInt(value) || 0 : value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Limpiar error previo
        setErrors(prev => ({ ...prev, attachment: '' }));

        // Validar tipo de archivo - SOLO PDF
        if (file.type !== ACCEPTED_MIME) {
            setErrors(prev => ({
                ...prev,
                attachment: 'Solo se permiten archivos PDF'
            }));
            // Limpiar el input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        // Validar tamaño
        if (file.size > MAX_FILE_SIZE_BYTES) {
            setErrors(prev => ({
                ...prev,
                attachment: `El archivo excede el tamaño máximo de ${MAX_FILE_SIZE_MB} MB`
            }));
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        // Leer como base64
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Full = reader.result as string;
            // Extraer solo la parte base64 (sin el prefijo data:application/pdf;base64,)
            const base64Data = base64Full.split(',')[1];

            setFormData(prev => ({
                ...prev,
                attachment: base64Data,
                attachmentFileName: file.name,
            }));

            setFileInfo({
                name: file.name,
                size: formatFileSize(file.size),
            });
        };
        reader.onerror = () => {
            setErrors(prev => ({
                ...prev,
                attachment: 'Error al leer el archivo. Intente de nuevo.'
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveFile = () => {
        setFormData(prev => ({
            ...prev,
            attachment: '',
            attachmentFileName: '',
        }));
        setFileInfo(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handlePreviewPdf = () => {
        if (!formData.attachment) return;

        // Reconstruir el data URI para abrir en nueva pestaña
        const base64 = formData.attachment.includes(',')
            ? formData.attachment
            : `data:application/pdf;base64,${formData.attachment}`;

        const byteCharacters = atob(base64.includes(',') ? base64.split(',')[1] : base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        // Liberar la URL después de un tiempo
        setTimeout(() => URL.revokeObjectURL(url), 10000);
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.contractId.trim()) newErrors.contractId = 'Requerido';
        if (!formData.entityId || formData.entityId < 1) newErrors.entityId = 'Requerido';
        if (!formData.contractType.trim()) newErrors.contractType = 'Requerido';
        if (!formData.startDate) newErrors.startDate = 'Requerido';
        if (!formData.endDate) newErrors.endDate = 'Requerido';
        if (!formData.status.trim()) newErrors.status = 'Requerido';
        if (!formData.notes.trim()) newErrors.notes = 'Requerido';

        // Validar que endDate sea posterior a startDate
        if (formData.startDate && formData.endDate && formData.endDate <= formData.startDate) {
            newErrors.endDate = 'Debe ser posterior a la fecha de inicio';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const payload: CreateRopaContractDto = {
                contractId: formData.contractId,
                entityId: formData.entityId,
                contractType: formData.contractType,
                startDate: new Date(formData.startDate),
                endDate: new Date(formData.endDate),
                status: formData.status,
                notes: formData.notes,
                attachment: formData.attachment || undefined,
                attachmentFileName: formData.attachmentFileName || undefined,
                createdBy: isEditing ? formData.createdBy : userData?.id,
                updatedBy: isEditing ? userData?.id : undefined,
            };

            if (isEditing && contract) {
                await updateContract.mutateAsync({ id: contract.id, ...payload });
            } else {
                await createContract.mutateAsync(payload);
            }
            onClose();
        } catch (error) {
            console.error('Error al guardar contrato:', error);
            alert('Error al guardar el contrato');
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

    const isPending = createContract.isPending || updateContract.isPending;

    // Obtener nombre de entidad para mostrar info
    const selectedEntity = entities?.find(e => e.id === formData.entityId);

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
                                {isEditing ? 'Editar Contrato' : 'Nuevo Contrato'}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {isEditing ? 'Modifica los datos del contrato' : 'Registra un nuevo contrato de tratamiento de datos'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Icon icon="mdi:close" width="24" height="24" className="text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} id="contracts-form" className="space-y-4">
                        {/* Fila 1: Contract ID y Entidad */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">ID Contrato *</label>
                                <input
                                    type="text"
                                    name="contractId"
                                    value={formData.contractId}
                                    onChange={handleChange}
                                    className={inputClass('contractId')}
                                    placeholder="Ej: CONT-2026-001"
                                />
                                {errors.contractId && <span className="text-xs text-red-500">{errors.contractId}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Entidad *</label>
                                <select
                                    name="entityId"
                                    value={formData.entityId}
                                    onChange={handleChange}
                                    className={inputClass('entityId')}
                                    disabled={isLoadingEntities}
                                >
                                    <option value={0}>Seleccionar entidad...</option>
                                    {entities?.map(entity => (
                                        <option key={entity.id} value={entity.id}>
                                            {entity.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.entityId && <span className="text-xs text-red-500">{errors.entityId}</span>}
                            </div>
                        </div>

                        {/* Fila 2: Tipo de contrato y Estado */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Contrato *</label>
                                <select
                                    name="contractType"
                                    value={formData.contractType}
                                    onChange={handleChange}
                                    className={inputClass('contractType')}
                                >
                                    <option value="">Seleccionar tipo...</option>
                                    <option value="Encargado">Encargado</option>
                                    <option value="Transmisión">Transmisión</option>
                                    <option value="Transferencia">Transferencia</option>
                                    <option value="Subencargado">Subencargado</option>
                                    <option value="Otro">Otro</option>
                                </select>
                                {errors.contractType && <span className="text-xs text-red-500">{errors.contractType}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado *</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className={inputClass('status')}
                                >
                                    <option value="Vigente">Vigente</option>
                                    <option value="Vencido">Vencido</option>
                                    <option value="En revisión">En revisión</option>
                                    <option value="Cancelado">Cancelado</option>
                                </select>
                                {errors.status && <span className="text-xs text-red-500">{errors.status}</span>}
                            </div>
                        </div>

                        {/* Fila 3: Fecha de inicio y Fecha de fin */}
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
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Fin *</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className={inputClass('endDate')}
                                />
                                {errors.endDate && <span className="text-xs text-red-500">{errors.endDate}</span>}
                            </div>
                        </div>

                        {/* Fila 4: Adjunto PDF */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Adjunto (Solo PDF, máx {MAX_FILE_SIZE_MB} MB)
                            </label>

                            {/* Si ya hay un archivo cargado, mostrar preview */}
                            {fileInfo ? (
                                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                                        <Icon icon="mdi:file-pdf-box" width="28" height="28" className="text-red-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                            {fileInfo.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {fileInfo.size}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={handlePreviewPdf}
                                            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                            title="Ver PDF"
                                        >
                                            <Icon icon="mdi:eye" width="18" height="18" className="text-blue-500" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleRemoveFile}
                                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                            title="Eliminar archivo"
                                        >
                                            <Icon icon="mdi:close-circle" width="18" height="18" className="text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Zona de drag & drop / click para subir */
                                <div
                                    className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                                        ${errors.attachment
                                            ? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/10'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10'
                                        }`}
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const file = e.dataTransfer.files[0];
                                        if (file) {
                                            // Simular el cambio del input
                                            const dt = new DataTransfer();
                                            dt.items.add(file);
                                            if (fileInputRef.current) {
                                                fileInputRef.current.files = dt.files;
                                                fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
                                            }
                                        }
                                    }}
                                >
                                    <Icon icon="mdi:file-pdf-box" width="48" height="48" className="mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <span className="font-medium text-purple-500">Haz clic aquí</span> o arrastra un archivo PDF
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                        Máximo {MAX_FILE_SIZE_MB} MB — Solo archivos .pdf
                                    </p>
                                </div>
                            )}

                            {/* Input file oculto */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,application/pdf"
                                className="hidden"
                            />

                            {errors.attachment && (
                                <span className="text-xs text-red-500 flex items-center gap-1">
                                    <Icon icon="mdi:alert-circle" width="14" height="14" />
                                    {errors.attachment}
                                </span>
                            )}
                        </div>

                        {/* Fila 5: Notas */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notas *</label>
                            <textarea
                                name="notes"
                                rows={4}
                                value={formData.notes}
                                onChange={handleChange}
                                className={`${inputClass('notes')} !h-auto py-2`}
                                placeholder="Notas adicionales sobre el contrato..."
                            />
                            {errors.notes && <span className="text-xs text-red-500">{errors.notes}</span>}
                        </div>

                        {/* Info de entidad seleccionada */}
                        {selectedEntity && (
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Icon icon="mdi:domain" width="20" height="20" className="text-green-500" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Entidad vinculada
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    <strong>{selectedEntity.name}</strong>
                                </p>
                            </div>
                        )}
                    </form>
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
                        form="contracts-form"
                        disabled={isPending}
                        className="flex-1 h-[40px] bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                    >
                        {isPending ? (
                            <LoadingSpinner size="small" />
                        ) : (
                            <>
                                <Icon icon={isEditing ? "mdi:content-save" : "mdi:plus"} width="20" height="20" />
                                {isEditing ? 'Actualizar' : 'Crear Contrato'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}