import { Link } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

export default function LoginPage() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        error,
        loading,
        handleSubmit,
    } = useLogin();

    return (
        <div className="min-h-screen flex">
            {/* Lado izquierdo - Formulario */}
            <div className="w-1/2 flex items-center justify-center ">
                <div className="w-[320px] h-[322px] bg-white dark:bg-[#151824] rounded-lg shadow-xl">
                    {/* Error message */}
                    {error && <ErrorMessage message={error} />}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center" >
                        {/* Email field */}
                        <div className="flex flex-col gap-2 mt-6">
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
                                className="w-[250px] h-[40px] px-4 rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
                            />
                        </div>

                        {/* Password field */}
                        <div className="flex flex-col gap-2">
                            <label 
                                htmlFor="password" 
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
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
                                className="w-[250px] h-[40px] px-4 rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
                            />
                        </div>

                        {/* Submit button */}
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-[250px] h-[40px] bg-blue-400 hover:bg-blue-500 dark:bg-blue-400 dark:hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? <LoadingSpinner size="small" /> : 'Iniciar Sesión'}
                        </button>
                    </form>

                    {/* Footer links */}
                    <div className="mt-4 text-center space-y-2 text-sm">
                        <p className="text-gray-600 dark:text-gray-400">
                            ¿No tienes cuenta?{' '}
                            <Link 
                                to="/signup" 
                                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                            >
                                Regístrate aquí
                            </Link>
                        </p>
                        <Link 
                            to="/forgot-password" 
                            className="block text-blue-600 dark:text-blue-400 font-medium hover:underline"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                </div>
            </div>

            {/* Lado derecho - Título */}
            <div className="w-1/2 flex items-center justify-center bg-blue-300 dark:bg-[#151824]">
                <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200">
                    Iniciar Sesión
                </h1>
            </div>
        </div>
    );
}