import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useCreateDataStorage, useUpdateDataStorage, useDepartments } from '../hooks/useData';
import type { RopaDataStorage, CreateRopaDataStorageDto } from '../types';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import { useUserStore } from '../../../../stores/userStore';
import { usePermissions } from '../../../../hooks/usePermissions';

interface DataFormProps {
    dataStorage: RopaDataStorage | null;
    onClose: () => void;
}

export default function DataForm({ dataStorage, onClose }: DataFormProps) {
    const createDataStorage = useCreateDataStorage();
    const updateDataStorage = useUpdateDataStorage();
    const { data: departments, isLoading: isLoadingDepartments } = useDepartments();
    const isEditing = !!dataStorage;
    const { userData } = useUserStore();
    const { isSuperAdmin } = usePermissions();

    const [formData, setFormData] = useState<{
        dbName: string;
        recordCount: number;
        creationDate: string;
        processingMode: string;
        dbLocation: string;
        country: string;
        securityMeasures: string;
        dbCustodian: number;
        createdBy: string | undefined;
        updatedBy: string | undefined;
    }>({
        dbName: '',
        recordCount: 0,
        creationDate: new Date().toISOString().split('T')[0],
        processingMode: '',
        dbLocation: '',
        country: '',
        securityMeasures: '',
        dbCustodian: 0,
        createdBy: undefined,
        updatedBy: undefined,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (dataStorage) {
            setFormData({
                dbName: dataStorage.dbName,
                recordCount: dataStorage.recordCount,
                creationDate: new Date(dataStorage.creationDate).toISOString().split('T')[0],
                processingMode: dataStorage.processingMode || '',
                dbLocation: dataStorage.dbLocation,
                country: dataStorage.country,
                securityMeasures: dataStorage.securityMeasures,
                dbCustodian: dataStorage.dbCustodian || 0,
                createdBy: dataStorage.createdBy,
                updatedBy: dataStorage.updatedBy,
            });
        }
    }, [dataStorage]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: name === 'dbCustodian' || name === 'recordCount'
                ? parseInt(value) || 0
                : value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.dbName.trim()) newErrors.dbName = 'Requerido';
        if (formData.recordCount < 0) newErrors.recordCount = 'Debe ser un número positivo';
        if (!formData.creationDate) newErrors.creationDate = 'Requerido';
        if (!formData.dbLocation.trim()) newErrors.dbLocation = 'Requerido';
        if (!formData.country.trim()) newErrors.country = 'Requerido';
        if (!formData.securityMeasures.trim()) newErrors.securityMeasures = 'Requerido';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const payload: CreateRopaDataStorageDto = {
                dbName: formData.dbName,
                recordCount: formData.recordCount,
                creationDate: new Date(formData.creationDate),
                processingMode: formData.processingMode || undefined,
                dbLocation: formData.dbLocation,
                country: formData.country,
                securityMeasures: formData.securityMeasures,
                dbCustodian: formData.dbCustodian > 0 ? formData.dbCustodian : undefined,
                createdBy: isEditing ? formData.createdBy : userData?.id,
                updatedBy: isEditing ? userData?.id : undefined,
            };

            if (isEditing && dataStorage) {
                await updateDataStorage.mutateAsync({ id: dataStorage.id, ...payload });
            } else {
                await createDataStorage.mutateAsync(payload);
            }
            onClose();
        } catch (error) {
            console.error('Error al guardar almacenamiento de datos:', error);
            alert('Error al guardar el registro');
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

    const isPending = createDataStorage.isPending || updateDataStorage.isPending;

    // Obtener nombre de departamento para mostrar info
    const selectedDepartment = departments?.find(d => d.id === formData.dbCustodian);

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
                                {isEditing ? 'Editar Almacenamiento' : 'Nuevo Almacenamiento de Datos'}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {isEditing ? 'Modifica los datos del registro' : 'Registra una nueva base de datos de tratamiento'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Icon icon="mdi:close" width="24" height="24" className="text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} id="data-storage-form" className="space-y-4">
                        {/* Fila 1: Nombre de BD y Cantidad de registros */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de Base de Datos *</label>
                                <input
                                    type="text"
                                    name="dbName"
                                    value={formData.dbName}
                                    onChange={handleChange}
                                    className={inputClass('dbName')}
                                    placeholder="Ej: BD_Clientes"
                                    maxLength={30}
                                />
                                {errors.dbName && <span className="text-xs text-red-500">{errors.dbName}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cantidad de Registros *</label>
                                <input
                                    type="number"
                                    name="recordCount"
                                    value={formData.recordCount}
                                    onChange={handleChange}
                                    className={inputClass('recordCount')}
                                    placeholder="Ej: 15000"
                                    min={0}
                                />
                                {errors.recordCount && <span className="text-xs text-red-500">{errors.recordCount}</span>}
                            </div>
                        </div>

                        {/* Fila 2: Modo de procesamiento y Fecha de creación */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Modo de Procesamiento</label>
                                <select
                                    name="processingMode"
                                    value={formData.processingMode}
                                    onChange={handleChange}
                                    className={inputClass('processingMode')}
                                >
                                    <option value="">Seleccionar modo...</option>
                                    <option value="Manual">Manual</option>
                                    <option value="Automatizado">Automatizado</option>
                                    <option value="Mixto">Mixto</option>
                                </select>
                                {errors.processingMode && <span className="text-xs text-red-500">{errors.processingMode}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Creación *</label>
                                <input
                                    type="date"
                                    name="creationDate"
                                    value={formData.creationDate}
                                    onChange={handleChange}
                                    className={inputClass('creationDate')}
                                />
                                {errors.creationDate && <span className="text-xs text-red-500">{errors.creationDate}</span>}
                            </div>
                        </div>

                        {/* Fila 3: Ubicación de BD y País */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ubicación de la Base de Datos *</label>
                                <input
                                    type="text"
                                    name="dbLocation"
                                    value={formData.dbLocation}
                                    onChange={handleChange}
                                    className={inputClass('dbLocation')}
                                    placeholder="Ej: Servidor local, AWS, Azure..."
                                    maxLength={30}
                                />
                                {errors.dbLocation && <span className="text-xs text-red-500">{errors.dbLocation}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">País *</label>
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
                                {errors.country && <span className="text-xs text-red-500">{errors.country}</span>}
                            </div>
                        </div>

                        {/* Fila 4: Custodio (Departamento) */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Custodio (Departamento)</label>
                            <select
                                name="dbCustodian"
                                value={formData.dbCustodian}
                                onChange={handleChange}
                                className={inputClass('dbCustodian')}
                                disabled={isLoadingDepartments}
                            >
                                <option value={0}>Seleccionar departamento...</option>
                                {departments?.map(dept => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.departmentName}
                                    </option>
                                ))}
                            </select>
                            {errors.dbCustodian && <span className="text-xs text-red-500">{errors.dbCustodian}</span>}
                        </div>

                        {/* Fila 5: Medidas de seguridad */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Medidas de Seguridad *</label>
                            <textarea
                                name="securityMeasures"
                                rows={4}
                                value={formData.securityMeasures}
                                onChange={handleChange}
                                className={`${inputClass('securityMeasures')} !h-auto py-2`}
                                placeholder="Describa las medidas de seguridad aplicadas a la base de datos..."
                                maxLength={255}
                            />
                            <div className="flex justify-between">
                                {errors.securityMeasures && <span className="text-xs text-red-500">{errors.securityMeasures}</span>}
                                <span className="text-xs text-gray-400 ml-auto">{formData.securityMeasures.length}/255</span>
                            </div>
                        </div>

                        {/* Info de departamento seleccionado */}
                        {selectedDepartment && (
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Icon icon="mdi:account-group" width="20" height="20" className="text-green-500" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Departamento custodio
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    <strong>{selectedDepartment.departmentName}</strong>
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
                        form="data-storage-form"
                        disabled={isPending}
                        className="flex-1 h-[40px] bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                    >
                        {isPending ? (
                            <LoadingSpinner size="small" />
                        ) : (
                            <>
                                <Icon icon={isEditing ? "mdi:content-save" : "mdi:plus"} width="20" height="20" />
                                {isEditing ? 'Actualizar' : 'Crear Registro'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}