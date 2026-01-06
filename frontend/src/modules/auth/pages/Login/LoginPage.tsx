import { Link } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import './LoginPage.css';
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
        
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <h1>Iniciar Sesión</h1>
                    <p>Accede a tu cuenta de Compliance JSSA</p>
                </div>

                {error && <ErrorMessage message={error} />}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
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
                            placeholder="��������"
                            required
                            minLength={6}
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-submit">
                        {loading ? <LoadingSpinner size="small" /> : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        ¿No tienes cuenta?{' '}
                        <Link to="/signup">Regístrate aquí</Link>
                    </p>
                    <Link to="/forgot-password" className="forgot-link">
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>
            </div>
        </div>
    );
}