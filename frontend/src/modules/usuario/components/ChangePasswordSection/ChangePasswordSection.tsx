import { Icon } from '@iconify/react'
import { useChangePassword } from '../../hooks/useChangePassword'
import ErrorMessage from '../../../auth/components/ErrorMessage/ErrorMessage'
import SuccessMessage from '../../../auth/components/SuccessMessage/SuccessMessage'
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner'

export default function ChangePasswordSection() {
    const {
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        error,
        success,
        loading,
        handleSubmit,
        handleCancel,
    } = useChangePassword()

    return (
        <div>

            {/* Mensajes */}
            {error && <ErrorMessage message={error} />}
            {success && (
                <SuccessMessage message="Tu contraseña ha sido actualizada correctamente" />
            )}
            {/* Formulario */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                {/* Nueva contraseña */}
                <div className="flex flex-col gap-2">
                    <label 
                        htmlFor="newPassword" 
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Nueva Contraseña
                    </label>
                    <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={6}
                        disabled={success || loading}
                        className="w-full h-[40px] px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
                    />
                    <small className="text-xs text-gray-500 dark:text-gray-400">
                        Mínimo 6 caracteres
                    </small>
                </div>

                {/* Confirmar contraseña */}
                <div className="flex flex-col gap-2">
                    <label 
                        htmlFor="confirmPassword" 
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Confirmar Nueva Contraseña
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={6}
                        disabled={success || loading}
                        className="w-full h-[40px] px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
                    />
                </div>

                {/* Botones */}
                <div className="flex gap-3 mt-4">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="flex-1 h-[40px] bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading || success}
                        className="flex-1 h-[40px] bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? <LoadingSpinner size="small" /> : 'Cambiar Contraseña'}
                    </button>
                </div>
            </form>
        </div>
    )
}