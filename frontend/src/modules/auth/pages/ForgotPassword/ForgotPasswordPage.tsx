import { Link } from 'react-router-dom';
import { useForgotPassword } from '../../hooks/useForgotPassword';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage/SuccessMessage';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

export default function ForgotPasswordPage() {
    const {
        email,
        setEmail,
        error,
        success,
        loading,
        handleSubmit,
    } = useForgotPassword();

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-[400px] bg-white dark:bg-[#151824] rounded-lg shadow-xl p-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                        ¿Olvidaste tu contraseña?
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Te enviaremos un correo para restablecer tu contraseña
                    </p>
                </div>

                {/* Error message */}
                {error && <ErrorMessage message={error} />}
                
                {/* Success message */}
                {success && (
                    <SuccessMessage
                        message="Revisa tu bandeja de entrada y haz clic en el enlace para restablecer tu contraseña."
                    />
                )}

                {!success ? (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Email field */}
                        <div className="flex flex-col gap-2">
                            <label 
                                htmlFor="email" 
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Correo electrónico
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                required
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
                            {loading ? <LoadingSpinner size="small" /> : 'Enviar correo de recuperación'}
                        </button>
                    </form>
                ) : (
                    <div className="flex justify-center mt-4">
                        <Link 
                            to="/login" 
                            className="w-full h-[40px] bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
                        >
                            Volver al inicio de sesión
                        </Link>
                    </div>
                )}

                {/* Footer link */}
                <div className="mt-6 text-center">
                    <Link 
                        to="/login" 
                        className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
                    >
                        ← Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}