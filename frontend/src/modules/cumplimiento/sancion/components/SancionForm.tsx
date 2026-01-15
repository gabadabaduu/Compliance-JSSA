import { useState, useEffect } from "react";
import { useCreateSanction, useUpdateSanction } from "../hooks/useSancion";
import { SANCTION_STAGES, SANCTION_STATUSES } from "../types";
import type { Sanction, CreateSanctionDto } from "../types";
import "./SancionForm.css";

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

        // Limpiar error del campo
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.number || formData.number < 0) newErrors.number = 'El número es requerido';
        if (!formData.entity || formData.entity < 1) newErrors.entity = 'La entidad es requerida';
        if (!formData.facts.trim()) newErrors.facts = 'Los hechos son requeridos';
        if (!formData.stage) newErrors.stage = 'La etapa es requerida';
        if (!formData.status) newErrors.status = 'El estado es requerido';

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

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content sancion-form-modal">
                <div className="modal-header">
                    <h2>{isEditing ? 'Editar Sanción' : 'Nueva Sanción'}</h2>
                    <button className="btn-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="sancion-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="number">Número *</label>
                            <input
                                id="number"
                                name="number"
                                type="number"
                                value={formData.number}
                                onChange={handleChange}
                                className={errors.number ? 'error' : ''}
                            />
                            {errors.number && <span className="error-message">{errors.number}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="entity">Entidad *</label>
                            <input
                                id="entity"
                                name="entity"
                                type="number"
                                value={formData.entity}
                                onChange={handleChange}
                                className={errors.entity ? 'error' : ''}
                            />
                            {errors.entity && <span className="error-message">{errors.entity}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="stage">Etapa *</label>
                            <select
                                id="stage"
                                name="stage"
                                value={formData.stage}
                                onChange={handleChange}
                                className={errors.stage ? 'error' : ''}
                            >
                                {SANCTION_STAGES.map(stage => (
                                    <option key={stage} value={stage}>
                                        {stage}
                                    </option>
                                ))}
                            </select>
                            {errors.stage && <span className="error-message">{errors.stage}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Estado *</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={errors.status ? 'error' : ''}
                            >
                                {SANCTION_STATUSES.map(status => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                            {errors.status && <span className="error-message">{errors.status}</span>}
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="facts">Hechos *</label>
                            <textarea
                                id="facts"
                                name="facts"
                                rows={4}
                                value={formData.facts}
                                onChange={handleChange}
                                className={errors.facts ? 'error' : ''}
                                placeholder="Describe los hechos que originan la sanción..."
                            />
                            {errors.facts && <span className="error-message">{errors.facts}</span>}
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="initial">Decisión Inicial</label>
                            <input
                                id="initial"
                                name="initial"
                                type="number"
                                value={formData.initial ?? ""}
                                onChange={handleChange}
                                placeholder="ID de la decisión inicial..."
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="reconsideration">Recurso de Reposición</label>
                            <input
                                id="reconsideration"
                                name="reconsideration"
                                type="number"
                                value={formData.reconsideration ?? ""}
                                onChange={handleChange}
                                placeholder="ID del recurso de reposición..."
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="appeal">Recurso de Apelación</label>
                            <input
                                id="appeal"
                                name="appeal"
                                type="number"
                                value={formData.appeal ?? ""}
                                onChange={handleChange}
                                placeholder="ID del recurso de apelación..."
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={createSanction.isPending || updateSanction.isPending}
                        >
                            {createSanction.isPending || updateSanction.isPending
                                ? 'Guardando...'
                                : isEditing ? 'Actualizar' : 'Crear'
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}