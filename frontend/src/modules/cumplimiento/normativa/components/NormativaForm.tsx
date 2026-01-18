import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useCreateRegulation, useUpdateRegulation } from '../hooks/useNormativa';
import type { Regulation, CreateRegulationDto, RegulationStatus } from '../types';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

interface NormativaFormProps {
    regulation: Regulation | null;
    onClose: () => void;
}

export default function NormativaForm({ regulation, onClose }: NormativaFormProps) {
    const createRegulation = useCreateRegulation();
    const updateRegulation = useUpdateRegulation();
    const isEditing = !!regulation;

    const [formData, setFormData] = useState({
        type: 1,
        number: 0,
        issueDate: new Date().toISOString().split('T')[0],
        year: new Date().getFullYear(),
        regulation: '',
        commonName: '',
        industry: 1,
        authority: 1,
        title: '',
        domain: 1,
        status: 'Vigente' as RegulationStatus,
        url: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (regulation) {
            setFormData({
                ...regulation,
                issueDate: new Date(regulation.issueDate).toISOString().split('T')[0],
            });
        }
    }, [regulation]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'number' || name === 'year' || name === 'type' || name === 'industry' || name === 'authority' || name === 'domain'
                ? parseInt(value) || 0
                : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.number || formData.number < 0) newErrors.number = 'Requerido';
        if (!formData.year || formData.year < 1900 || formData.year > 2100) newErrors.year = 'Año inválido';
        if (!formData.issueDate) newErrors.issueDate = 'Requerido';
        if (!formData.status) newErrors.status = 'Requerido';
        if (!formData.title.trim()) newErrors.title = 'Requerido';
        if (!formData.commonName.trim()) newErrors.commonName = 'Requerido';
        if (!formData.regulation.trim()) newErrors.regulation = 'Requerido';
        if (!formData.type || formData.type < 1) newErrors.type = 'Requerido';
        if (!formData.industry || formData.industry < 1) newErrors.industry = 'Requerido';
        if (!formData.authority || formData.authority < 1) newErrors.authority = 'Requerido';
        if (!formData.domain || formData.domain < 1) newErrors.domain = 'Requerido';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const payload: CreateRegulationDto = {
                ...formData,
                issueDate: new Date(formData.issueDate),
            };

            if (isEditing && regulation) {
                await updateRegulation.mutateAsync({ id: regulation.id, ...payload });
            } else {
                await createRegulation.mutateAsync(payload);
            }
            onClose();
        } catch (error) {
            console.error('Error al guardar normativa:', error);
            alert('Error al guardar la normativa');
        }
    };

    const inputClass = (field: string) => `
        w-full h-[40px] px-4 rounded-lg border 
        ${errors[field] ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'}
        bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
        placeholder-gray-400 dark:placeholder-gray-500 
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
        transition-colors
    `;

    const isPending = createRegulation.isPending || updateRegulation.isPending;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white dark:bg-[#151824] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                            <Icon icon={isEditing ? "mdi:pencil" : "mdi:plus"} width="24" height="24" className="text-indigo-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                {isEditing ? 'Editar Normativa' : 'Nueva Normativa'}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {isEditing ? 'Modifica los datos de la normativa' : 'Registra una nueva regulación'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Icon icon="mdi:close" width="24" height="24" className="text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} id="normativa-form" className="space-y-4">
                        {/* Fila 1: Número, Año, Fecha, Estado */}
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
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado *</label>
                                <select name="status" value={formData.status} onChange={handleChange} className={inputClass('status')}>
                                    <option value="Vigente">Vigente</option>
                                    <option value="Compilada">Compilada</option>
                                </select>
                            </div>
                        </div>

                        {/* Título */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Título *</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputClass('title')} placeholder="Título de la normativa" />
                            {errors.title && <span className="text-xs text-red-500">{errors.title}</span>}
                        </div>

                        {/* Nombre Común */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Común *</label>
                            <input type="text" name="commonName" value={formData.commonName} onChange={handleChange} className={inputClass('commonName')} placeholder="Ej: Ley de Protección de Datos" />
                            {errors.commonName && <span className="text-xs text-red-500">{errors.commonName}</span>}
                        </div>

                        {/* Regulación */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción de la Regulación *</label>
                            <textarea name="regulation" rows={3} value={formData.regulation} onChange={handleChange} className={`${inputClass('regulation')} !h-auto py-2`} placeholder="Descripción detallada..." />
                            {errors.regulation && <span className="text-xs text-red-500">{errors.regulation}</span>}
                        </div>

                        {/* URL */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">URL del documento</label>
                            <input type="url" name="url" value={formData.url} onChange={handleChange} className={inputClass('url')} placeholder="https://ejemplo.com/documento.pdf" />
                        </div>

                        {/* Fila de catálogos */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo *</label>
                                <input type="number" name="type" value={formData.type} onChange={handleChange} className={inputClass('type')} />
                                {errors.type && <span className="text-xs text-red-500">{errors.type}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Industria *</label>
                                <input type="number" name="industry" value={formData.industry} onChange={handleChange} className={inputClass('industry')} />
                                {errors.industry && <span className="text-xs text-red-500">{errors.industry}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Autoridad *</label>
                                <input type="number" name="authority" value={formData.authority} onChange={handleChange} className={inputClass('authority')} />
                                {errors.authority && <span className="text-xs text-red-500">{errors.authority}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dominio *</label>
                                <input type="number" name="domain" value={formData.domain} onChange={handleChange} className={inputClass('domain')} />
                                {errors.domain && <span className="text-xs text-red-500">{errors.domain}</span>}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                    <button type="button" onClick={onClose} disabled={isPending} className="flex-1 h-[40px] bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" form="normativa-form" disabled={isPending} className="flex-1 h-[40px] bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 flex items-center justify-center">
                        {isPending ? <LoadingSpinner size="small" /> : isEditing ? 'Actualizar' : 'Crear'}
                    </button>
                </div>
            </div>
        </div>
    );
}