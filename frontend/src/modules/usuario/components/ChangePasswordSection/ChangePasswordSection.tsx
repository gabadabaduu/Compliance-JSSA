import { useChangePassword } from '../../hooks/useChangePassword'
import ErrorMessage from '../../../auth/components/ErrorMessage/ErrorMessage'
import SuccessMessage from '../../../auth/components/SuccessMessage/SuccessMessage'
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner'
import './ChangePasswordSection.css'

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
        <div className="change-password-section">
            <div className="change-password-header">
                <h2>Cambiar Contraseña</h2>
                <p>Actualiza tu contraseña de acceso</p>
            </div>

            {error && <ErrorMessage message={error} />}
            {success && (
                <SuccessMessage
                    message="Tu contraseña ha sido actualizada correctamente"
                />
            )}

            <form onSubmit={handleSubmit} className="change-password-form">
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
                        disabled={success || loading}
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
                        disabled={success || loading}
                    />
                </div>

                <div className="button-group">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn-cancel"
                        disabled={loading}
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={loading || success}
                        className="btn-submit"
                    >
                        {loading ? <LoadingSpinner size="small" /> : 'Cambiar Contraseña'}
                    </button>
                </div>
            </form>
        </div>
    )
}