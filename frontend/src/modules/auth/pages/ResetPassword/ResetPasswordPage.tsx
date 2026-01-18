import { Link } from 'react-router-dom';
import { useResetPassword } from '../../hooks/useResetPassword';
import { Icon } from '@iconify/react';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage/SuccessMessage';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

export default function ResetPasswordPage() {
    const {
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        error,
        success,
        loading,
        isValidToken,
        checkingToken,
        handleSubmit,
    } = useResetPassword();

    if (checkingToken) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#EFF2FB] dark:bg-[#1a1d29]">
                <div className="text-center">
                    <LoadingSpinner size="large" text="Verificando enlace..." />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#EFF2FB] dark:bg-[#1a1d29] p-6">
            <div className="w-full max-w-md bg-white dark:bg-[#151824] rounded-lg shadow-xl p-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                        <Icon icon="mdi:lock-reset" width="32" height="32" className="text-blue-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                        Restablecer Contraseña
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Ingresa tu nueva contraseña
                    </p>
                </div>

                {/* Error con enlace */}
                {error && !isValidToken && (
                    <div className="mb-4">
                        <ErrorMessage message={error} />
                        <Link 
                            to="/forgot-password" 
                            className="block text-center mt-3 text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
                        >
                            Solicitar nuevo enlace
                        </Link>
                    </div>
                )}

                {/* Error normal */}
                {error && isValidToken && <ErrorMessage message={error} />}

                {/* Success message */}
                {success && (
                    <SuccessMessage
                        message="Tu contraseña ha sido restablecida exitosamente. Redirigiendo al inicio de sesión..."
                    />
                )}

                {/* Form */}
                {isValidToken && !success && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                                disabled={loading}
                                className="w-full h-[40px] px-4 rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
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
                                disabled={loading}
                                className="w-full h-[40px] px-4 rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
                            />
                        </div>

                        {/* Submit button */}
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full h-[40px] bg-blue-400 hover:bg-blue-500 dark:bg-blue-400 dark:hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center mt-2"
                        >
                            {loading ? <LoadingSpinner size="small" /> : 'Restablecer Contraseña'}
                        </button>
                    </form>
                )}

                {/* Footer link */}
                {!success && (
                    <div className="mt-6 text-center">
                        <Link 
                            to="/login" 
                            className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
                        >
                            ← Volver al inicio de sesión
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}