import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useCreateEntity, useUpdateEntity, useContactChannels } from '../hooks/useEntities';
import type { RopaEntity, CreateRopaEntityDto } from '../types';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import { useUserStore } from '../../../../stores/userStore';
import { usePermissions } from '../../../../hooks/usePermissions';

interface EntitiesFormProps {
    entity: RopaEntity | null;
    onClose: () => void;
}

export default function EntitiesForm({ entity, onClose }: EntitiesFormProps) {
    const createEntity = useCreateEntity();
    const updateEntity = useUpdateEntity();
    const { data: contactChannels, isLoading: isLoadingChannels } = useContactChannels();
    const isEditing = !!entity;
    const { userData } = useUserStore();
    const { isSuperAdmin } = usePermissions();

    const [formData, setFormData] = useState<{
        name: string;
        taxId: string;
        type: string;
        nature: string;
        address: string;
        state: string;
        city: string;
        country: string;
        landlineNumber: string;
        mobileNumber: string;
        email: string;
        website: string;
        serviceDescription: string;
        contactChannelsId: number;
        privacyPolicyAttachment: string;
        privacyPolicyUrl: string;
        createdBy: string | undefined;
        updatedBy: string | undefined;
    }>({
        name: '',
        taxId: '',
        type: '',
        nature: '',
        address: '',
        state: '',
        city: '',
        country: '',
        landlineNumber: '',
        mobileNumber: '',
        email: '',
        website: '',
        serviceDescription: '',
        contactChannelsId: 0,
        privacyPolicyAttachment: '',
        privacyPolicyUrl: '',
        createdBy: undefined,
        updatedBy: undefined,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (entity) {
            setFormData({
                name: entity.name,
                taxId: entity.taxId,
                type: entity.type,
                nature: entity.nature,
                address: entity.address,
                state: entity.state || '',
                city: entity.city || '',
                country: entity.country || '',
                landlineNumber: entity.landlineNumber || '',
                mobileNumber: entity.mobileNumber || '',
                email: entity.email || '',
                website: entity.website || '',
                serviceDescription: entity.serviceDescription || '',
                contactChannelsId: entity.contactChannelsId || 0,
                privacyPolicyAttachment: entity.privacyPolicyAttachment || '',
                privacyPolicyUrl: entity.privacyPolicyUrl || '',
                createdBy: entity.createdBy,
                updatedBy: entity.updatedBy,
            });
        }
    }, [entity]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: name === 'contactChannelsId' ? parseInt(value) || 0 : value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Requerido';
        if (!formData.taxId.trim()) newErrors.taxId = 'Requerido';
        if (!formData.type.trim()) newErrors.type = 'Requerido';
        if (!formData.nature.trim()) newErrors.nature = 'Requerido';
        if (!formData.address.trim()) newErrors.address = 'Requerido';

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const payload: CreateRopaEntityDto = {
                name: formData.name,
                taxId: formData.taxId,
                type: formData.type,
                nature: formData.nature,
                address: formData.address,
                state: formData.state || undefined,
                city: formData.city || undefined,
                country: formData.country || undefined,
                landlineNumber: formData.landlineNumber || undefined,
                mobileNumber: formData.mobileNumber || undefined,
                email: formData.email || undefined,
                website: formData.website || undefined,
                serviceDescription: formData.serviceDescription || undefined,
                contactChannelsId: formData.contactChannelsId > 0 ? formData.contactChannelsId : undefined,
                privacyPolicyAttachment: formData.privacyPolicyAttachment || undefined,
                privacyPolicyUrl: formData.privacyPolicyUrl || undefined,
                createdBy: isEditing ? formData.createdBy : userData?.id,
                updatedBy: isEditing ? userData?.id : undefined,
            };

            if (isEditing && entity) {
                await updateEntity.mutateAsync({ id: entity.id, ...payload });
            } else {
                await createEntity.mutateAsync(payload);
            }
            onClose();
        } catch (error) {
            console.error('Error al guardar entidad:', error);
            alert('Error al guardar la entidad');
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

    const isPending = createEntity.isPending || updateEntity.isPending;

    // Obtener nombre de canal de contacto para mostrar info
    const selectedChannel = contactChannels?.find(c => c.id === formData.contactChannelsId);

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
                                {isEditing ? 'Editar Entidad' : 'Nueva Entidad'}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {isEditing ? 'Modifica los datos de la entidad' : 'Registra una nueva entidad de tratamiento de datos'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Icon icon="mdi:close" width="24" height="24" className="text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} id="entities-form" className="space-y-4">
                        {/* Fila 1: Nombre y NIT/Tax ID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={inputClass('name')}
                                    placeholder="Nombre de la entidad"
                                    maxLength={200}
                                />
                                {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">NIT / Tax ID *</label>
                                <input
                                    type="text"
                                    name="taxId"
                                    value={formData.taxId}
                                    onChange={handleChange}
                                    className={inputClass('taxId')}
                                    placeholder="Ej: 900.123.456-7"
                                    maxLength={200}
                                />
                                {errors.taxId && <span className="text-xs text-red-500">{errors.taxId}</span>}
                            </div>
                        </div>

                        {/* Fila 2: Tipo y Naturaleza */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo *</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className={inputClass('type')}
                                >
                                    <option value="">Seleccionar tipo...</option>
                                    <option value="Responsable">Responsable</option>
                                    <option value="Encargado">Encargado</option>
                                    <option value="Tercero">Tercero</option>
                                    <option value="Transferente">Transferente</option>
                                    <option value="Otro">Otro</option>
                                </select>
                                {errors.type && <span className="text-xs text-red-500">{errors.type}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Naturaleza *</label>
                                <select
                                    name="nature"
                                    value={formData.nature}
                                    onChange={handleChange}
                                    className={inputClass('nature')}
                                >
                                    <option value="">Seleccionar naturaleza...</option>
                                    <option value="Pública">Pública</option>
                                    <option value="Privada">Privada</option>
                                    <option value="Mixta">Mixta</option>
                                </select>
                                {errors.nature && <span className="text-xs text-red-500">{errors.nature}</span>}
                            </div>
                        </div>

                        {/* Fila 3: Dirección */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dirección *</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className={inputClass('address')}
                                placeholder="Dirección completa"
                                maxLength={255}
                            />
                            {errors.address && <span className="text-xs text-red-500">{errors.address}</span>}
                        </div>

                        {/* Fila 4: País, Departamento/Estado, Ciudad */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">País</label>
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className={inputClass('country')}
                                >
                                    <option value="">Seleccionar país...</option>
                                    <option value="Colombia">Colombia</option>
                                    <option value="México">México</option>
                                    <option value="Argentina">Argentina</option>
                                    <option value="Chile">Chile</option>
                                    <option value="Perú">Perú</option>
                                    <option value="Ecuador">Ecuador</option>
                                    <option value="Brasil">Brasil</option>
                                    <option value="Estados Unidos">Estados Unidos</option>
                                    <option value="España">España</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Departamento / Estado</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className={inputClass('state')}
                                    placeholder="Ej: Cundinamarca"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ciudad</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className={inputClass('city')}
                                    placeholder="Ej: Bogotá"
                                />
                            </div>
                        </div>

                        {/* Fila 5: Teléfonos y Email */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono Fijo</label>
                                <input
                                    type="text"
                                    name="landlineNumber"
                                    value={formData.landlineNumber}
                                    onChange={handleChange}
                                    className={inputClass('landlineNumber')}
                                    placeholder="Ej: +57 1 1234567"
                                    maxLength={30}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono Móvil</label>
                                <input
                                    type="text"
                                    name="mobileNumber"
                                    value={formData.mobileNumber}
                                    onChange={handleChange}
                                    className={inputClass('mobileNumber')}
                                    placeholder="Ej: +57 300 1234567"
                                    maxLength={30}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={inputClass('email')}
                                    placeholder="correo@entidad.com"
                                    maxLength={30}
                                />
                                {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                            </div>
                        </div>

                        {/* Fila 6: Sitio Web y Canal de Contacto */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sitio Web</label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className={inputClass('website')}
                                    placeholder="https://www.entidad.com"
                                    maxLength={255}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Canal de Contacto</label>
                                <select
                                    name="contactChannelsId"
                                    value={formData.contactChannelsId}
                                    onChange={handleChange}
                                    className={inputClass('contactChannelsId')}
                                    disabled={isLoadingChannels}
                                >
                                    <option value={0}>Seleccionar canal...</option>
                                    {contactChannels?.map(channel => (
                                        <option key={channel.id} value={channel.id}>
                                            {channel.channelType}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Fila 7: Descripción de Servicios */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción de Servicios</label>
                            <textarea
                                name="serviceDescription"
                                rows={3}
                                value={formData.serviceDescription}
                                onChange={handleChange}
                                className={`${inputClass('serviceDescription')} !h-auto py-2`}
                                placeholder="Describa los servicios que presta la entidad..."
                                maxLength={255}
                            />
                            <span className="text-xs text-gray-400 ml-auto">{formData.serviceDescription.length}/255</span>
                        </div>

                        {/* Fila 8: Política de Privacidad */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Política de Privacidad (Adjunto URL)</label>
                                <input
                                    type="url"
                                    name="privacyPolicyAttachment"
                                    value={formData.privacyPolicyAttachment}
                                    onChange={handleChange}
                                    className={inputClass('privacyPolicyAttachment')}
                                    placeholder="https://ejemplo.com/politica.pdf"
                                    maxLength={255}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Política de Privacidad (URL pública)</label>
                                <input
                                    type="url"
                                    name="privacyPolicyUrl"
                                    value={formData.privacyPolicyUrl}
                                    onChange={handleChange}
                                    className={inputClass('privacyPolicyUrl')}
                                    placeholder="https://www.entidad.com/privacidad"
                                    maxLength={255}
                                />
                            </div>
                        </div>

                        {/* Info de canal de contacto seleccionado */}
                        {selectedChannel && (
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Icon icon="mdi:phone-message" width="20" height="20" className="text-green-500" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Canal de contacto vinculado
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    <strong>{selectedChannel.channelType}</strong>
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
                        form="entities-form"
                        disabled={isPending}
                        className="flex-1 h-[40px] bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                    >
                        {isPending ? (
                            <LoadingSpinner size="small" />
                        ) : (
                            <>
                                <Icon icon={isEditing ? "mdi:content-save" : "mdi:plus"} width="20" height="20" />
                                {isEditing ? 'Actualizar' : 'Crear Entidad'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}