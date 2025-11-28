import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import { validateFullName, validatePassword, validatePasswordMatch } from '../validator';

export function useSignup() {
    const navigate = useNavigate();
    const { signup } = useAuthStore();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const nameValidation = validateFullName(fullName);
        if (!nameValidation.valid) {
            setError(nameValidation.error!);
            return;
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            setError(passwordValidation.error!);
            return;
        }

        const passwordMatchValidation = validatePasswordMatch(password, confirmPassword);
        if (!passwordMatchValidation.valid) {
            setError(passwordMatchValidation.error!);
            return;
        }

        setLoading(true);

        const result = await signup(email, password, fullName);

        if (result.success) {
            navigate('/app/dashboard');
        } else {
            setError(result.error || 'Error al crear la cuenta');
        }

        setLoading(false);
    };

    return {
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
    };
}