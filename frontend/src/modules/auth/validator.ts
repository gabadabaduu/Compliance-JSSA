export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; error?: string } => {
    if (password.length < 6) {
        return { valid: false, error: 'La contraseña debe tener al menos 6 caracteres' };
    }
    return { valid: true };
};

export const validatePasswordMatch = (password: string, confirmPassword: string): { valid: boolean; error?: string } => {
    if (password !== confirmPassword) {
        return { valid: false, error: 'Las contraseñas no coinciden' };
    }
    return { valid: true };
};

export const validateFullName = (name: string): { valid: boolean; error?: string } => {
    if (!name.trim()) {
        return { valid: false, error: 'El nombre completo es requerido' };
    }
    if (name.trim().length < 3) {
        return { valid: false, error: 'El nombre debe tener al menos 3 caracteres' };
    }
    return { valid: true };
};