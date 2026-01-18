import { Icon } from '@iconify/react'
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import { useCruduser } from '../../hooks/useCruduser';
import { useUserStore } from '../../../../stores/userStore';
import ErrorMessage from '../../../auth/components/ErrorMessage';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface CreateUserModalProps {
    isOpen: boolean
    onClose: () => void
}
export default function CrudUsuario({ isOpen, onClose }: CreateUserModalProps) {
    // Obtener nombreEmpresa del userStore (credenciales del usuario logueado)
    const { userData } = useUserStore();

    const {
        fullName,
        setFullName,
        email,
        setEmail,
        phone,
        setPhone,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        error,
        loading,
        handleSubmit,
    } = useCruduser();

    const handleFormSubmit = async (e: React.FormEvent) => {
        await handleSubmit(e)
        // Si no hay error, cerrar modal
        if (!error) {
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-[#151824] rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <Icon icon="mdi:account-plus" width="24" height="24" className="text-blue-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                Crear Usuario
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Nuevo usuario en {userData?.nombreEmpresa}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <Icon icon="mdi:close" width="24" height="24" className="text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {error && <ErrorMessage message={error} />}

                    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                        {/* Nombre completo */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nombre completo
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Juan Pérez"
                                required
                                disabled={loading}
                                className="w-full h-[40px] px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
                            />
                        </div>

                        {/* Empresa (readonly) */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="nombreEmpresa" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Empresa
                            </label>
                            <input
                                id="nombreEmpresa"
                                type="text"
                                value={userData?.nombreEmpresa || ''}
                                disabled
                                readOnly
                                className="w-full h-[40px] px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            />
                            <small className="text-xs text-gray-500 dark:text-gray-400">
                                Este campo no se puede modificar
                            </small>
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Correo electrónico
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="correo@empresa.com"
                                required
                                disabled={loading}
                                className="w-full h-[40px] px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
                            />
                        </div>

                        {/* Teléfono */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Teléfono
                            </label>
                            <PhoneInput
                                country={'co'}
                                value={phone}
                                onChange={setPhone}
                                disabled={loading}
                                inputProps={{
                                    name: 'phone',
                                    required: true,
                                }}
                                containerClass="!w-full"
                                inputClass="!w-full !h-[40px] !rounded-lg !border-gray-300 dark:!border-gray-700 dark:!bg-gray-800 dark:!text-white"
                                buttonClass="!rounded-l-lg !border-gray-300 dark:!border-gray-700 dark:!bg-gray-700"
                                dropdownClass="dark:!bg-gray-800 dark:!text-white"
                                enableSearch={true}
                                searchPlaceholder="Buscar país..."
                            />
                        </div>

                        {/* Contraseña */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                disabled={loading}
                                className="w-full h-[40px] px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
                            />
                            <small className="text-xs text-gray-500 dark:text-gray-400">
                                Mínimo 6 caracteres
                            </small>
                        </div>

                        {/* Confirmar contraseña */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Confirmar contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                disabled={loading}
                                className="w-full h-[40px] px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
                            />
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3 mt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 h-[40px] bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 h-[40px] bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? <LoadingSpinner size="small" /> : 'Crear Usuario'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}