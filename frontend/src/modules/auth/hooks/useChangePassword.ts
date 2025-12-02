import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import { validatePassword, validatePasswordMatch } from '../validator';

export function useChangePassword() {
    const navigate = useNavigate();
    const { changePassword } = useAuthStore();
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validaciones
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.valid) {
            setError(passwordValidation.error! );
            return;
        }

        const passwordMatchValidation = validatePasswordMatch(newPassword, confirmPassword);
        if (!passwordMatchValidation.valid) {
            setError(passwordMatchValidation. error!);
            return;
        }

        setLoading(true);

        const result = await changePassword(newPassword);

        if (result.success) {
            setSuccess(true);
            setNewPassword('');
            setConfirmPassword('');
            
            // Redirigir después de 2 segundos
            setTimeout(() => {
                navigate('/app/dashboard');
            }, 2000);
        } else {
            setError(result.error || 'Error al cambiar la contraseña');
        }
        
        setLoading(false);
    };

    const handleCancel = () => {
        navigate('/app/dashboard');
    };

    return {
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        error,
        success,
        loading,
        handleSubmit,
        handleCancel,
    };
}