import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../stores/authStore'

export function useSignup() {
    const [fullName, setFullName] = useState('')
    const [nombreEmpresa, setNombreEmpresa] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('') // Nuevo campo
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const { signup } = useAuthStore()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')

        // Validaciones
        if (!fullName.trim()) {
            setError('El nombre completo es requerido')
            return
        }

        if (!nombreEmpresa.trim()) {
            setError('El nombre de la empresa es requerido')
            return
        }

        if (!phone.trim()) {
            setError('El número de teléfono es requerido')
            return
        }

        if (phone.length < 10) {
            setError('El número de teléfono debe tener al menos 10 dígitos')
            return
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            return
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            return
        }

        setLoading(true)

        try {
            const result = await signup(email, password, fullName, nombreEmpresa, phone)

            if (result.success) {
                navigate('/app/dashboard')
            } else {
                setError(result.error || 'Error al crear la cuenta')
            }
        } catch (err: any) {
            setError(err.message || 'Error inesperado')
        } finally {
            setLoading(false)
        }
    }

    return {
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
    }
}