import { useState, useEffect } from 'react';
import { useCreateRegulation, useUpdateRegulation } from '../hooks/useNormativa';
import type { Regulation, CreateRegulationDto, RegulationStatus } from '../types';
import './NormativaForm.css';

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
        // Limpiar error del campo
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.number || formData.number < 0) newErrors.number = 'El número es requerido';
        if (!formData.year || formData.year < 1900 || formData.year > 2100) newErrors.year = 'Año inválido';
        if (!formData.issueDate) newErrors.issueDate = 'La fecha es requerida';
        if (!formData.status) newErrors.status = 'El estado es requerido';
        if (!formData.title.trim()) newErrors.title = 'El título es requerido';
        if (!formData.commonName.trim()) newErrors.commonName = 'El nombre común es requerido';
        if (!formData.regulation.trim()) newErrors.regulation = 'La regulación es requerida';
        if (!formData.type || formData.type < 1) newErrors.type = 'El tipo es requerido';
        if (!formData.industry || formData.industry < 1) newErrors.industry = 'La industria es requerida';
        if (!formData.authority || formData.authority < 1) newErrors.authority = 'La autoridad es requerida';
        if (!formData.domain || formData.domain < 1) newErrors.domain = 'El dominio es requerido';

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
                await updateRegulation.mutateAsync({
                    id: regulation.id,
                    ...payload,
                });
            } else {
                await createRegulation.mutateAsync(payload);
            }

            onClose();
        } catch (error) {
            console.error('Error al guardar normativa:', error);
            alert('Error al guardar la normativa');
        }
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content normativa-form-modal">
                <div className="modal-header">
                    <h2>{isEditing ? 'Editar Normativa' : 'Nueva Normativa'}</h2>
                    <button className="btn-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="normativa-form">
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
                            <label htmlFor="status">Estado *</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={errors.status ? 'error' : ''}
                            >
                                <option value="Vigente">Vigente</option>
                                <option value="Compilada">Compilada</option>
                            </select>
                            {errors.status && <span className="error-message">{errors.status}</span>}
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="title">Título *</label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                className={errors.title ? 'error' : ''}
                            />
                            {errors.title && <span className="error-message">{errors.title}</span>}
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="commonName">Nombre Común *</label>
                            <input
                                id="commonName"
                                name="commonName"
                                type="text"
                                value={formData.commonName}
                                onChange={handleChange}
                                className={errors.commonName ? 'error' : ''}
                            />
                            {errors.commonName && <span className="error-message">{errors.commonName}</span>}
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="regulation">Regulación *</label>
                            <textarea
                                id="regulation"
                                name="regulation"
                                rows={3}
                                value={formData.regulation}
                                onChange={handleChange}
                                className={errors.regulation ? 'error' : ''}
                            />
                            {errors.regulation && <span className="error-message">{errors.regulation}</span>}
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

                        <div className="form-group">
                            <label htmlFor="type">Tipo *</label>
                            <input
                                id="type"
                                name="type"
                                type="number"
                                value={formData.type}
                                onChange={handleChange}
                                className={errors.type ? 'error' : ''}
                            />
                            {errors.type && <span className="error-message">{errors.type}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="industry">Industria *</label>
                            <input
                                id="industry"
                                name="industry"
                                type="number"
                                value={formData.industry}
                                onChange={handleChange}
                                className={errors.industry ? 'error' : ''}
                            />
                            {errors.industry && <span className="error-message">{errors.industry}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="authority">Autoridad *</label>
                            <input
                                id="authority"
                                name="authority"
                                type="number"
                                value={formData.authority}
                                onChange={handleChange}
                                className={errors.authority ? 'error' : ''}
                            />
                            {errors.authority && <span className="error-message">{errors.authority}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="domain">Dominio *</label>
                            <input
                                id="domain"
                                name="domain"
                                type="number"
                                value={formData.domain}
                                onChange={handleChange}
                                className={errors.domain ? 'error' : ''}
                            />
                            {errors.domain && <span className="error-message">{errors.domain}</span>}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={createRegulation.isPending || updateRegulation.isPending}
                        >
                            {createRegulation.isPending || updateRegulation.isPending
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