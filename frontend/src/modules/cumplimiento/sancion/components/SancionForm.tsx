import { useState, useEffect } from "react";
import { Icon } from '@iconify/react';
import { useCreateSanction, useUpdateSanction } from "../hooks/useSancion";
import { SANCTION_STAGES, SANCTION_STATUSES } from "../types";
import type { Sanction, CreateSanctionDto } from "../types";
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

interface Props {
    sanction: Sanction | null;
    onClose: () => void;
}

export default function SancionForm({ sanction, onClose }: Props) {
    const createSanction = useCreateSanction();
    const updateSanction = useUpdateSanction();
    const isEditing = !!sanction;

    const [formData, setFormData] = useState<CreateSanctionDto>({
        number: 0,
        entity: 0,
        facts: "",
        stage: "Decisión Inicial",
        status: "En trámite",
        initial: null,
        reconsideration: null,
        appeal: null,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!sanction) return;

        setFormData({
            number: sanction.number,
            entity: sanction.entity,
            facts: sanction.facts,
            stage: sanction.stage,
            status: sanction.status,
            initial: sanction.initial,
            reconsideration: sanction.reconsideration,
            appeal: sanction.appeal,
        });
    }, [sanction]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]:
                name === "number" || name === "entity" || name === "initial" || name === "reconsideration" || name === "appeal"
                    ? (value === "" ? null : Number(value))
                    : value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.number || formData.number < 0) newErrors.number = 'Requerido';
        if (!formData.entity || formData.entity < 1) newErrors.entity = 'Requerido';
        if (!formData.facts.trim()) newErrors.facts = 'Requerido';
        if (!formData.stage) newErrors.stage = 'Requerido';
        if (!formData.status) newErrors.status = 'Requerido';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            if (isEditing && sanction) {
                await updateSanction.mutateAsync({
                    id: sanction.id,
                    ...formData,
                });
            } else {
                await createSanction.mutateAsync(formData);
            }
            onClose();
        } catch (err) {
            console.error(err);
            alert("Error al guardar sanción");
        }
    };

    const inputClass = (field: string) => `
        w-full h-[40px] px-4 rounded-lg border 
        ${errors[field] ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'}
        bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
        placeholder-gray-400 dark:placeholder-gray-500 
        focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent 
        transition-colors
    `;

    const isPending = createSanction.isPending || updateSanction.isPending;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white dark:bg-[#151824] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center">
                            <Icon icon={isEditing ? "mdi:pencil" : "mdi:plus"} width="24" height="24" className="text-rose-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                {isEditing ? 'Editar Sanción' : 'Nueva Sanción'}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {isEditing ? 'Modifica los datos de la sanción' : 'Registra una nueva sanción'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Icon icon="mdi:close" width="24" height="24" className="text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} id="sancion-form" className="space-y-4">
                        {/* Fila 1: Número, Entidad, Etapa, Estado */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Número *</label>
                                <input type="number" name="number" value={formData.number ?? ''} onChange={handleChange} className={inputClass('number')} />
                                {errors.number && <span className="text-xs text-red-500">{errors.number}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Entidad *</label>
                                <input type="number" name="entity" value={formData.entity ?? ''} onChange={handleChange} className={inputClass('entity')} />
                                {errors.entity && <span className="text-xs text-red-500">{errors.entity}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Etapa *</label>
                                <select name="stage" value={formData.stage} onChange={handleChange} className={inputClass('stage')}>
                                    {SANCTION_STAGES.map(stage => (
                                        <option key={stage} value={stage}>{stage}</option>
                                    ))}
                                </select>
                                {errors.stage && <span className="text-xs text-red-500">{errors.stage}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado *</label>
                                <select name="status" value={formData.status} onChange={handleChange} className={inputClass('status')}>
                                    {SANCTION_STATUSES.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                                {errors.status && <span className="text-xs text-red-500">{errors.status}</span>}
                            </div>
                        </div>

                        {/* Hechos */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Hechos *</label>
                            <textarea 
                                name="facts" 
                                rows={4} 
                                value={formData.facts} 
                                onChange={handleChange} 
                                className={`${inputClass('facts')} !h-auto py-2`} 
                                placeholder="Describe los hechos que originan la sanción..." 
                            />
                            {errors.facts && <span className="text-xs text-red-500">{errors.facts}</span>}
                        </div>

                        {/* Resoluciones relacionadas */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Decisión Inicial</label>
                                <input 
                                    type="number" 
                                    name="initial" 
                                    value={formData.initial ?? ''} 
                                    onChange={handleChange} 
                                    className={inputClass('initial')} 
                                    placeholder="ID resolución" 
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Recurso Reposición</label>
                                <input 
                                    type="number" 
                                    name="reconsideration" 
                                    value={formData.reconsideration ?? ''} 
                                    onChange={handleChange} 
                                    className={inputClass('reconsideration')} 
                                    placeholder="ID resolución" 
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Recurso Apelación</label>
                                <input 
                                    type="number" 
                                    name="appeal" 
                                    value={formData.appeal ?? ''} 
                                    onChange={handleChange} 
                                    className={inputClass('appeal')} 
                                    placeholder="ID resolución" 
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                    <button type="button" onClick={onClose} disabled={isPending} className="flex-1 h-[40px] bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" form="sancion-form" disabled={isPending} className="flex-1 h-[40px] bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 flex items-center justify-center">
                        {isPending ? <LoadingSpinner size="small" /> : isEditing ? 'Actualizar' : 'Crear'}
                    </button>
                </div>
            </div>
        </div>
    );
}