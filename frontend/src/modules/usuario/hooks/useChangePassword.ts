import { useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'
import { validatePassword, validatePasswordMatch } from '../../auth/validator'

export function useChangePassword() {
    const { changePassword } = useAuthStore()

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess(false)

        // Validaciones
        const passwordValidation = validatePassword(newPassword)
        if (!passwordValidation.valid) {
            setError(passwordValidation.error!)
            return
        }

        const passwordMatchValidation = validatePasswordMatch(newPassword, confirmPassword)
        if (!passwordMatchValidation.valid) {
            setError(passwordMatchValidation.error!)
            return
        }

        setLoading(true)

        const result = await changePassword(newPassword)

        if (result.success) {
            setSuccess(true)
            setNewPassword('')
            setConfirmPassword('')
        } else {
            setError(result.error || 'Error al cambiar la contraseña')
        }

        setLoading(false)
    }

    const handleCancel = () => {
        setNewPassword('')
        setConfirmPassword('')
        setError('')
        setSuccess(false)
    }

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
    }
}