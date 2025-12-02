import { Link } from 'react-router-dom';
import { useForgotPassword } from '../../hooks/useForgotPassword';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage/SuccessMessage';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import './ForgotPasswordPage.css';

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
        <div className="forgot-password-page">
            <div className="forgot-password-card">
                <div className="forgot-password-header">
                    <h1>¿Olvidaste tu contraseña?</h1>
                    <p>Te enviaremos un correo para restablecer tu contraseña</p>
                </div>

                {error && <ErrorMessage message={error} />}
                {success && (
                    <SuccessMessage
                        message="Revisa tu bandeja de entrada y haz clic en el enlace para restablecer tu contraseña."
                    />
                )}

                {!success ? (
                    <form onSubmit={handleSubmit} className="forgot-password-form">
                        <div className="form-group">
                            <label htmlFor="email">Correo electrónico</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email. com"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button type="submit" disabled={loading} className="btn-submit">
                            {loading ? <LoadingSpinner size="small" /> : 'Enviar correo de recuperación'}
                        </button>
                    </form>
                ) : (
                    <div className="success-actions">
                        <Link to="/login" className="btn-back">
                            Volver al inicio de sesión
                        </Link>
                    </div>
                )}

                <div className="forgot-password-footer">
                    <Link to="/login" className="back-link">
                        ← Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}