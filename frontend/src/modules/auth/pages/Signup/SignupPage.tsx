import { Link } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useSignup } from '../../hooks/useSignup';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

export default function SignupPage() {
    const {
        fullName,
        setFullName,
        nombreEmpresa,
        setNombreEmpresa,
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
    } = useSignup();

    return (
        <div className="min-h-screen flex">
            {/* Lado izquierdo - Formulario */}
            <div className="w-1/2 flex items-center justify-center">
                <div className="w-[400px] bg-white dark:bg-[#151824] rounded-lg shadow-xl overflow-y-auto max-h-[95vh]">
                    {/* Error message */}
                    {error && <ErrorMessage message={error} />}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center p-3">
                        {/* Full Name field */}
                        <div className="flex flex-col gap-2 w-full">
                            <label 
                                htmlFor="fullName" 
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
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
                                className="w-full h-[40px] px-4 rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
                            />
                        </div>

                        {/* Company Name field */}
                        <div className="flex flex-col gap-2 w-full">
                            <label 
                                htmlFor="nombreEmpresa" 
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Nombre de la empresa
                            </label>
                            <input
                                id="nombreEmpresa"
                                type="text"
                                value={nombreEmpresa}
                                onChange={(e) => setNombreEmpresa(e.target.value)}
                                placeholder="Mi Empresa S.A.S"
                                required
                                disabled={loading}
                                className="w-full h-[40px] px-4 rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
                            />
                        </div>

                        {/* Email field */}
                        <div className="flex flex-col gap-2 w-full">
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

                        {/* Phone field */}
                        <div className="flex flex-col gap-2 w-full">
                            <label 
                                htmlFor="phone" 
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Número de teléfono
                            </label>
                            <div className="[&_.react-tel-input_.form-control]:!bg-white dark:[&_.react-tel-input_.form-control]:!bg-gray-700 [&_.react-tel-input_.form-control]:!border-gray-300 dark:[&_.react-tel-input_.form-control]:!border-gray-600 [&_.react-tel-input_.form-control]:!text-gray-900 dark:[&_.react-tel-input_.form-control]:!text-white [&_.react-tel-input_.flag-dropdown]:!bg-white dark:[&_.react-tel-input_.flag-dropdown]:!bg-gray-700 [&_.react-tel-input_.flag-dropdown]:!border-gray-300 dark:[&_.react-tel-input_.flag-dropdown]:!border-gray-600">
                                <PhoneInput
                                    country={'co'}
                                    value={phone}
                                    onChange={setPhone}
                                    disabled={loading}
                                    inputProps={{
                                        name: 'phone',
                                        required: true,
                                        autoFocus: false
                                    }}
                                    containerClass="w-full"
                                    placeholder="Ingresa tu número de teléfono"
                                    enableSearch={true}
                                    searchPlaceholder="Buscar país..."
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div className="flex flex-col gap-2 w-full">
                            <label 
                                htmlFor="password" 
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
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
                                className="w-full h-[40px] px-4 rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
                            />
                            <small className="text-xs text-gray-500 dark:text-gray-400">Mínimo 6 caracteres</small>
                        </div>

                        {/* Confirm Password field */}
                        <div className="flex flex-col gap-2 w-full">
                            <label 
                                htmlFor="confirmPassword" 
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
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
                                className="w-full h-[40px] px-4 rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
                            />
                        </div>

                        {/* Submit button */}
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full h-[40px] bg-blue-400 hover:bg-blue-500 dark:bg-blue-400 dark:hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center "
                        >
                            {loading ? <LoadingSpinner size="small" /> : 'Crear Cuenta'}
                        </button>
                    </form>

                    {/* Footer links */}
                    <div className="pb-4 text-center  text-sm">
                        <p className="text-gray-600 dark:text-gray-400">
                            ¿Ya tienes cuenta?{' '}
                            <Link 
                                to="/login" 
                                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                            >
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Lado derecho - Título */}
            <div className="w-1/2 flex items-center justify-center bg-blue-300 dark:bg-[#151824]">
                <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200">
                    Crear Cuenta
                </h1>
            </div>
        </div>
    );
}