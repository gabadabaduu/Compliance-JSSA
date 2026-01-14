import { useState, useEffect } from 'react';
import { useCreateSanction, useUpdateSanction } from '../hooks/useSancion';
import type { Sanction, CreateSanctionDto, SanctionStage, SanctionStatus } from '../types';
import './SancionForm.css';

interface SancionFormProps {
    sanction: Sanction | null;
    onClose: () => void;
}

export default function SancionForm({ sanction, onClose }: SancionFormProps) {
    const createSanction = useCreateSanction();
    const updateSanction = useUpdateSanction();
    const isEditing = !!sanction;

    const [formData, setFormData] = useState({
        number: 0,
        entity: 1,
        facts: '',
        stage: 'Desicion inicial' as SanctionStage,
        status: 'En tramite' as SanctionStatus,
        initial: '',
        reconsideration: '',
        appeal: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (sanction) {
            setFormData(sanction);
        }
    }, [sanction]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'number' || name === 'entity'
                ? parseInt(value) || 0
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
            const payload: CreateSanctionDto = formData;

            if (isEditing && sanction) {
                await updateSanction.mutateAsync({
                    id: sanction.id,
                    ...payload,
                });
            } else {
                await createSanction.mutateAsync(payload);
            }

            onClose();
        } catch (error) {
            console.error('Error al guardar sanción:', error);
            alert('Error al guardar la sanción');
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
                                <option value="Desicion inicial">Decisión Inicial</option>
                                <option value="Recurso de Reposicion">Recurso de Reposición</option>
                                <option value="Recurso de Apelacion">Recurso de Apelación</option>
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
                                <option value="En tramite">En Trámite</option>
                                <option value="En firme">En Firme</option>
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
                            <textarea
                                id="initial"
                                name="initial"
                                rows={3}
                                value={formData.initial}
                                onChange={handleChange}
                                placeholder="Información sobre la decisión inicial..."
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="reconsideration">Recurso de Reposición</label>
                            <textarea
                                id="reconsideration"
                                name="reconsideration"
                                rows={3}
                                value={formData.reconsideration}
                                onChange={handleChange}
                                placeholder="Información sobre el recurso de reposición..."
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="appeal">Recurso de Apelación</label>
                            <textarea
                                id="appeal"
                                name="appeal"
                                rows={3}
                                value={formData.appeal}
                                onChange={handleChange}
                                placeholder="Información sobre el recurso de apelación..."
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