import { Link } from 'react-router-dom';
import { useResetPassword } from '../../hooks/useResetPassword';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage/SuccessMessage';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import './ResetPasswordPage.css';

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
            <div className="reset-password-page">
                <div className="checking-token">
                    <LoadingSpinner size="large" text="Verificando enlace..." />
                </div>
            </div>
        );
    }

    return (
        <div className="reset-password-page">
            <div className="reset-password-card">
                <div className="reset-password-header">
                    <h1>Restablecer Contraseña</h1>
                    <p>Ingresa tu nueva contraseña</p>
                </div>

                {error && !isValidToken && (
                    <div className="error-with-link">
                        <ErrorMessage message={error} />
                        <Link to="/forgot-password" className="request-new-link">
                            Solicitar nuevo enlace
                        </Link>
                    </div>
                )}

                {error && isValidToken && <ErrorMessage message={error} />}

                {success && (
                    <SuccessMessage
                        message="Tu contraseña ha sido restablecida exitosamente.  Redirigiendo al inicio de sesión..."
                    />
                )}

                {isValidToken && !success && (
                    <form onSubmit={handleSubmit} className="reset-password-form">
                        <div className="form-group">
                            <label htmlFor="newPassword">Nueva Contraseña</label>
                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                disabled={loading}
                            />
                            <small>Mínimo 6 caracteres</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                disabled={loading}
                            />
                        </div>

                        <button type="submit" disabled={loading} className="btn-submit">
                            {loading ? <LoadingSpinner size="small" /> : 'Restablecer Contraseña'}
                        </button>
                    </form>
                )}

                {!success && (
                    <div className="reset-password-footer">
                        <Link to="/login" className="back-link">
                            ← Volver al inicio de sesión
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}