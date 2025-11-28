import { useState } from 'react';
import { useAuthStore } from '../../../stores/authStore';

export function useForgotPassword() {
    const { resetPassword } = useAuthStore();

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        const result = await resetPassword(email);

        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.error || 'Error al enviar el correo de recuperación');
        }

        setLoading(false);
    };

    return {
        email,
        setEmail,
        error,
        success,
        loading,
        handleSubmit,
    };
}