import { useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'

export default function ForgotPasswordPage() {
    const { resetPassword } = useAuthStore()

    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess(false)
        setLoading(true)

        const result = await resetPassword(email)

        if (result.success) {
            setSuccess(true)
        } else {
            setError(result.error || 'Error al enviar el correo de recuperación')
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 m-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        ¿Olvidaste tu contraseña?
                    </h1>
                    <p className="text-gray-600">
                        Te enviaremos un correo para restablecer tu contraseña
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                        <p className="font-medium">Error</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
                        <p className="font-medium">¡Correo enviado!</p>
                        <p className="text-sm">Revisa tu bandeja de entrada y haz clic en el enlace para restablecer tu contraseña.</p>
                    </div>
                )}

                {!success ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Correo electrónico
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="tu@email.com"
                                autoComplete="email"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Enviando...
                                </span>
                            ) : (
                                'Enviar correo de recuperación'
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="text-center">
                        <a
                            href="/login"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
                        >
                            Volver al inicio de sesión
                        </a>
                    </div>
                )}

                <div className="mt-6 text-center">
                    <a href="/login" className="text-sm text-blue-600 hover:text-blue-500 transition">
                        ← Volver al inicio de sesión
                    </a>
                </div>
            </div>
        </div>
    )
}