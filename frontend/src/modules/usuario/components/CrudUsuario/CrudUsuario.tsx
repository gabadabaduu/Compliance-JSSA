import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import { useCruduser } from '../../hooks/useCruduser';
import { useUserStore } from '../../../../stores/userStore';
import ErrorMessage from '../../../auth/components/ErrorMessage';
import './CrudUsuario.css';

export default function CrudUsuario() {
    // Obtener nombreEmpresa del userStore (credenciales del usuario logueado)
    const { userData } = useUserStore();

    const {
        fullName,
        setFullName,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        error,
        loading,
        handleSubmit,
    } = useCruduser();

    return (
        <div className="signup-page">
            <div className="signup-card">
                <div className="signup-header">
                    <h1>Crear Cuenta</h1>
                    <p>Regístrate en Compliance JSSA</p>
                </div>

                {error && <ErrorMessage message={error} />}

                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="form-group">
                        <label htmlFor="fullName">Nombre completo</label>
                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Juan Pérez"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="nombreEmpresa">Nombre de la empresa</label>
                        <input
                            id="nombreEmpresa"
                            type="text"
                            value={userData?.nombreEmpresa || ''}
                            placeholder="Mi Empresa S.A. S"
                            disabled={true}
                            readOnly
                            className="input-readonly"
                        />
                        <small>Este campo no se puede modificar</small>
                    </div>

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

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            minLength={6}
                            disabled={loading}
                        />
                        <small>Mínimo 6 caracteres</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar contraseña</label>
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
                        {loading ? <LoadingSpinner size="small" /> : 'Crear Cuenta'}
                    </button>
                </form>
                
            </div>
        </div>
    );
}