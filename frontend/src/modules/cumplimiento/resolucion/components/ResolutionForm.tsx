import { useState, useEffect } from 'react';
import { useCreateResolution, useUpdateResolution } from '../hooks/useResolution';
import { useCatalog } from '../hooks/useCatalog';
import type { Resolution, CreateResolutionDto, ResolutionOutcome } from '../types';
import './ResolutionForm.css';

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
        // Limpiar error del campo
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.sanctions.trim()) newErrors.sanctions = 'Las sanciones son requeridas';
        if (!formData.number || formData.number < 0) newErrors.number = 'El número es requerido';
        if (!formData.year || formData.year < 1900 || formData.year > 2100) newErrors.year = 'Año inválido';
        if (!formData.issueDate) newErrors.issueDate = 'La fecha es requerida';
        if (!formData.resolution.trim()) newErrors.resolution = 'La resolución es requerida';
        if (!formData.resolutionType.trim()) newErrors.resolutionType = 'El tipo de resolución es requerido';
        if (!formData.legalGrounds.trim()) newErrors.legalGrounds = 'Los fundamentos legales son requeridos';
        if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
        if (!formData.orders.trim()) newErrors.orders = 'Las órdenes son requeridas';
        if (!formData.outcome) newErrors.outcome = 'El resultado es requerido';
        if (!formData.infringements || formData.infringements < 1) newErrors.infringements = 'La infracción es requerida';
        if (!formData.sanctionType || formData.sanctionType < 1) newErrors.sanctionType = 'El tipo de sanción es requerido';
        if (formData.amount < 0) newErrors.amount = 'El monto debe ser mayor o igual a 0';

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
                await updateResolution.mutateAsync({
                    id: resolution.id,
                    ...payload,
                });
            } else {
                await createResolution.mutateAsync(payload);
            }

            onClose();
        } catch (error) {
            console.error('Error al guardar resolución:', error);
            alert('Error al guardar la resolución');
        }
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content resolution-form-modal">
                <div className="modal-header">
                    <h2>{isEditing ? 'Editar Resolución' : 'Nueva Resolución'}</h2>
                    <button className="btn-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="resolution-form">
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
                            <label htmlFor="year">Año *</label>
                            <input
                                id="year"
                                name="year"
                                type="number"
                                value={formData.year}
                                onChange={handleChange}
                                className={errors.year ? 'error' : ''}
                            />
                            {errors.year && <span className="error-message">{errors.year}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="issueDate">Fecha de Emisión *</label>
                            <input
                                id="issueDate"
                                name="issueDate"
                                type="date"
                                value={formData.issueDate}
                                onChange={handleChange}
                                className={errors.issueDate ? 'error' : ''}
                            />
                            {errors.issueDate && <span className="error-message">{errors.issueDate}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="outcome">Resultado *</label>
                            <select
                                id="outcome"
                                name="outcome"
                                value={formData.outcome}
                                onChange={handleChange}
                                className={errors.outcome ? 'error' : ''}
                            >
                                <option value="Acogida">Acogida</option>
                                <option value="No Acogida">No Acogida</option>
                                <option value="Parcialmente Acogida">Parcialmente Acogida</option>
                            </select>
                            {errors.outcome && <span className="error-message">{errors.outcome}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="amount">Monto *</label>
                            <input
                                id="amount"
                                name="amount"
                                type="number"
                                value={formData.amount}
                                onChange={handleChange}
                                className={errors.amount ? 'error' : ''}
                            />
                            {errors.amount && <span className="error-message">{errors.amount}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="infringements">Infracción *</label>
                            <select
                                id="infringements"
                                name="infringements"
                                value={formData.infringements}
                                onChange={handleChange}
                                className={errors.infringements ? 'error' : ''}
                            >
                                {(infringements as any[]).map((inf) => (
                                    <option key={inf.id} value={inf.id}>
                                        {inf.description
                                            ? `Art. ${inf.article} - ${inf.section}`
                                            : inf.name}
                                    </option>
                                ))}
                            </select>
                            {errors.infringements && <span className="error-message">{errors.infringements}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="sanctionType">Tipo de Sanción *</label>
                            <select
                                id="sanctionType"
                                name="sanctionType"
                                value={formData.sanctionType}
                                onChange={handleChange}
                                className={errors.sanctionType ? 'error' : ''}
                            >
                                {(sanctionTypes as any[]).map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name || `Art. ${type.article} - ${type.section}`}
                                    </option>
                                ))}
                            </select>
                            {errors.sanctionType && <span className="error-message">{errors.sanctionType}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="resolutionType">Tipo de Resolución *</label>
                            <input
                                id="resolutionType"
                                name="resolutionType"
                                type="text"
                                value={formData.resolutionType}
                                onChange={handleChange}
                                className={errors.resolutionType ? 'error' : ''}
                            />
                            {errors.resolutionType && <span className="error-message">{errors.resolutionType}</span>}
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="sanctions">Sanciones *</label>
                            <input
                                id="sanctions"
                                name="sanctions"
                                type="text"
                                value={formData.sanctions}
                                onChange={handleChange}
                                className={errors.sanctions ? 'error' : ''}
                            />
                            {errors.sanctions && <span className="error-message">{errors.sanctions}</span>}
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="resolution">Resolución *</label>
                            <textarea
                                id="resolution"
                                name="resolution"
                                rows={3}
                                value={formData.resolution}
                                onChange={handleChange}
                                className={errors.resolution ? 'error' : ''}
                            />
                            {errors.resolution && <span className="error-message">{errors.resolution}</span>}
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="legalGrounds">Fundamentos Legales *</label>
                            <textarea
                                id="legalGrounds"
                                name="legalGrounds"
                                rows={3}
                                value={formData.legalGrounds}
                                onChange={handleChange}
                                className={errors.legalGrounds ? 'error' : ''}
                            />
                            {errors.legalGrounds && <span className="error-message">{errors.legalGrounds}</span>}
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="description">Descripción *</label>
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                value={formData.description}
                                onChange={handleChange}
                                className={errors.description ? 'error' : ''}
                            />
                            {errors.description && <span className="error-message">{errors.description}</span>}
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="orders">Órdenes *</label>
                            <textarea
                                id="orders"
                                name="orders"
                                rows={3}
                                value={formData.orders}
                                onChange={handleChange}
                                className={errors.orders ? 'error' : ''}
                            />
                            {errors.orders && <span className="error-message">{errors.orders}</span>}
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="attachment">Adjunto</label>
                            <input
                                id="attachment"
                                name="attachment"
                                type="text"
                                value={formData.attachment}
                                onChange={handleChange}
                                placeholder="URL del adjunto"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="url">URL</label>
                            <input
                                id="url"
                                name="url"
                                type="url"
                                value={formData.url}
                                onChange={handleChange}
                                placeholder="https://ejemplo.com/documento.pdf"
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
                            disabled={createResolution.isPending || updateResolution.isPending}
                        >
                            {createResolution.isPending || updateResolution.isPending
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