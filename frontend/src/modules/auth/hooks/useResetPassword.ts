import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import { validatePassword, validatePasswordMatch } from '../validator';

export function useResetPassword() {
    const navigate = useNavigate();
    const { changePassword } = useAuthStore();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isValidToken, setIsValidToken] = useState(false);
    const [checkingToken, setCheckingToken] = useState(true);

    // Verificar token en la URL
    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const type = hashParams.get('type');

        if (accessToken && type === 'recovery') {
            setIsValidToken(true);
        } else {
            setError('Enlace de recuperación inválido o expirado');
        }

        setCheckingToken(false);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validaciones
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.valid) {
            setError(passwordValidation.error!);
            return;
        }

        const passwordMatchValidation = validatePasswordMatch(newPassword, confirmPassword);
        if (!passwordMatchValidation.valid) {
            setError(passwordMatchValidation.error!);
            return;
        }

        setLoading(true);

        const result = await changePassword(newPassword);

        if (result.success) {
            setSuccess(true);

            // Redirigir al login después de 3 segundos
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } else {
            setError(result.error || 'Error al restablecer la contraseña');
        }

        setLoading(false);
    };

    return {
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
    };
}