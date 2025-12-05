import { Link } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useSignup } from '../../hooks/useSignup';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import './SignupPage.css';

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
                            value={nombreEmpresa}
                            onChange={(e) => setNombreEmpresa(e.target.value)}
                            placeholder="Mi Empresa S.A. S"
                            required
                            disabled={loading}
                        />
                    </div>

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
                        <label htmlFor="phone">Número de teléfono</label>
                        <PhoneInput
                            country={'co'} // Colombia por defecto
                            value={phone}
                            onChange={setPhone}
                            disabled={loading}
                            inputProps={{
                                name: 'phone',
                                required: true,
                                autoFocus: false
                            }}
                            containerClass="phone-input-container"
                            inputClass="phone-input"
                            buttonClass="phone-input-button"
                            dropdownClass="phone-input-dropdown"
                            placeholder="Ingresa tu número de teléfono"
                            enableSearch={true}
                            searchPlaceholder="Buscar país..."
                            localization={{
                                'Search': 'Buscar',
                                'searchPlaceholder': 'Buscar país...',
                                'noEntriesText': 'No se encontraron resultados',
                                'Afghanistan': 'Afganistán',
                                'Colombia': 'Colombia',
                                'United States': 'Estados Unidos',
                                'Mexico': 'México',
                                'Spain': 'España',
                                'Argentina': 'Argentina',
                                'Chile': 'Chile',
                                'Peru': 'Perú',
                                'Venezuela': 'Venezuela'
                            }}
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

                <div className="signup-footer">
                    <p>
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login">Inicia sesión aquí</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}