import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useCreateResolution, useUpdateResolution } from '../hooks/useResolution';
import { useCatalog } from '../hooks/useCatalog';
import type { Resolution, CreateResolutionDto, ResolutionOutcome } from '../types';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

interface ResolutionFormProps {
    resolution: Resolution | null;
    onClose: () => void;
}

export default function ResolutionForm({ resolution, onClose }: ResolutionFormProps) {
    const createResolution = useCreateResolution();
    const updateResolution = useUpdateResolution();
    const isEditing = !!resolution;

    // Cargar catálogos
    const { data: infringements } = useCatalog('infringements');
    const { data: sanctionTypes } = useCatalog('sanction-types');

    const [formData, setFormData] = useState({
        sanctions: '',
        number: 0,
        issueDate: new Date().toISOString().split('T')[0],
        year: new Date().getFullYear(),
        resolution: '',
        resolutionType: '',
        infringements: 1,
        legalGrounds: '',
        sanctionType: 1,
        amount: 0,
        description: '',
        outcome: 'Acogida' as ResolutionOutcome,
        orders: '',
        attachment: '',
        url: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (resolution) {
            setFormData({
                ...resolution,
                issueDate: new Date(resolution.issueDate).toISOString().split('T')[0],
                attachment: resolution.attachment || '',
                url: resolution.url || '',
            });
        }
    }, [resolution]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['number', 'year', 'infringements', 'sanctionType', 'amount'].includes(name)
                ? parseInt(value) || 0
                : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.sanctions.trim()) newErrors.sanctions = 'Requerido';
        if (!formData.number || formData.number < 0) newErrors.number = 'Requerido';
        if (!formData.year || formData.year < 1900 || formData.year > 2100) newErrors.year = 'Año inválido';
        if (!formData.issueDate) newErrors.issueDate = 'Requerido';
        if (!formData.resolution.trim()) newErrors.resolution = 'Requerido';
        if (!formData.resolutionType.trim()) newErrors.resolutionType = 'Requerido';
        if (!formData.legalGrounds.trim()) newErrors.legalGrounds = 'Requerido';
        if (!formData.description.trim()) newErrors.description = 'Requerido';
        if (!formData.orders.trim()) newErrors.orders = 'Requerido';
        if (!formData.outcome) newErrors.outcome = 'Requerido';
        if (!formData.infringements || formData.infringements < 1) newErrors.infringements = 'Requerido';
        if (!formData.sanctionType || formData.sanctionType < 1) newErrors.sanctionType = 'Requerido';
        if (formData.amount < 0) newErrors.amount = 'Debe ser ≥ 0';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const payload: CreateResolutionDto = {
                ...formData,
                issueDate: new Date(formData.issueDate),
                attachment: formData.attachment || null,
                url: formData.url || null,
            };

            if (isEditing && resolution) {
                await updateResolution.mutateAsync({ id: resolution.id, ...payload });
            } else {
                await createResolution.mutateAsync(payload);
            }
            onClose();
        } catch (error) {
            console.error('Error al guardar resolución:', error);
            alert('Error al guardar la resolución');
        }
    };

    const inputClass = (field: string) => `
        w-full h-[40px] px-4 rounded-lg border 
        ${errors[field] ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'}
        bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
        placeholder-gray-400 dark:placeholder-gray-500 
        focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent 
        transition-colors
    `;

    const isPending = createResolution.isPending || updateResolution.isPending;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white dark:bg-[#151824] rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                            <Icon icon={isEditing ? "mdi:pencil" : "mdi:plus"} width="24" height="24" className="text-amber-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                {isEditing ? 'Editar Resolución' : 'Nueva Resolución'}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {isEditing ? 'Modifica los datos de la resolución' : 'Registra una nueva resolución'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Icon icon="mdi:close" width="24" height="24" className="text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} id="resolution-form" className="space-y-4">
                        {/* Fila 1: Número, Año, Fecha, Resultado */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Número *</label>
                                <input type="number" name="number" value={formData.number} onChange={handleChange} className={inputClass('number')} />
                                {errors.number && <span className="text-xs text-red-500">{errors.number}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Año *</label>
                                <input type="number" name="year" value={formData.year} onChange={handleChange} className={inputClass('year')} />
                                {errors.year && <span className="text-xs text-red-500">{errors.year}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha Emisión *</label>
                                <input type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} className={inputClass('issueDate')} />
                                {errors.issueDate && <span className="text-xs text-red-500">{errors.issueDate}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Resultado *</label>
                                <select name="outcome" value={formData.outcome} onChange={handleChange} className={inputClass('outcome')}>
                                    <option value="Acogida">Acogida</option>
                                    <option value="No Acogida">No Acogida</option>
                                    <option value="Parcialmente Acogida">Parcialmente Acogida</option>
                                </select>
                                {errors.outcome && <span className="text-xs text-red-500">{errors.outcome}</span>}
                            </div>
                        </div>

                        {/* Fila 2: Monto, Infracción, Tipo Sanción, Tipo Resolución */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Monto *</label>
                                <input type="number" name="amount" value={formData.amount} onChange={handleChange} className={inputClass('amount')} />
                                {errors.amount && <span className="text-xs text-red-500">{errors.amount}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Infracción *</label>
                                <select name="infringements" value={formData.infringements} onChange={handleChange} className={inputClass('infringements')}>
                                    {(infringements as any[] || []).map((inf) => (
                                        <option key={inf.id} value={inf.id}>
                                            {inf.description ? `Art. ${inf.article} - ${inf.section}` : inf.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.infringements && <span className="text-xs text-red-500">{errors.infringements}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo Sanción *</label>
                                <select name="sanctionType" value={formData.sanctionType} onChange={handleChange} className={inputClass('sanctionType')}>
                                    {(sanctionTypes as any[] || []).map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name || `Art. ${type.article} - ${type.section}`}
                                        </option>
                                    ))}
                                </select>
                                {errors.sanctionType && <span className="text-xs text-red-500">{errors.sanctionType}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo Resolución *</label>
                                <input type="text" name="resolutionType" value={formData.resolutionType} onChange={handleChange} className={inputClass('resolutionType')} placeholder="Ej: Administrativa" />
                                {errors.resolutionType && <span className="text-xs text-red-500">{errors.resolutionType}</span>}
                            </div>
                        </div>

                        {/* Sanciones */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sanciones *</label>
                            <input type="text" name="sanctions" value={formData.sanctions} onChange={handleChange} className={inputClass('sanctions')} placeholder="Descripción de las sanciones" />
                            {errors.sanctions && <span className="text-xs text-red-500">{errors.sanctions}</span>}
                        </div>

                        {/* Resolución */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Resolución *</label>
                            <textarea name="resolution" rows={2} value={formData.resolution} onChange={handleChange} className={`${inputClass('resolution')} !h-auto py-2`} placeholder="Texto de la resolución..." />
                            {errors.resolution && <span className="text-xs text-red-500">{errors.resolution}</span>}
                        </div>

                        {/* Fundamentos Legales */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fundamentos Legales *</label>
                            <textarea name="legalGrounds" rows={2} value={formData.legalGrounds} onChange={handleChange} className={`${inputClass('legalGrounds')} !h-auto py-2`} placeholder="Base legal de la resolución..." />
                            {errors.legalGrounds && <span className="text-xs text-red-500">{errors.legalGrounds}</span>}
                        </div>

                        {/* Descripción */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción *</label>
                            <textarea name="description" rows={2} value={formData.description} onChange={handleChange} className={`${inputClass('description')} !h-auto py-2`} placeholder="Descripción detallada..." />
                            {errors.description && <span className="text-xs text-red-500">{errors.description}</span>}
                        </div>

                        {/* Órdenes */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Órdenes *</label>
                            <textarea name="orders" rows={2} value={formData.orders} onChange={handleChange} className={`${inputClass('orders')} !h-auto py-2`} placeholder="Órdenes emitidas..." />
                            {errors.orders && <span className="text-xs text-red-500">{errors.orders}</span>}
                        </div>

                        {/* URL y Adjunto */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">URL del documento</label>
                                <input type="url" name="url" value={formData.url} onChange={handleChange} className={inputClass('url')} placeholder="https://ejemplo.com/documento.pdf" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Adjunto</label>
                                <input type="text" name="attachment" value={formData.attachment} onChange={handleChange} className={inputClass('attachment')} placeholder="URL del adjunto" />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                    <button type="button" onClick={onClose} disabled={isPending} className="flex-1 h-[40px] bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" form="resolution-form" disabled={isPending} className="flex-1 h-[40px] bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 flex items-center justify-center">
                        {isPending ? <LoadingSpinner size="small" /> : isEditing ? 'Actualizar' : 'Crear'}
                    </button>
                </div>
            </div>
        </div>
    );
}