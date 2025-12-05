import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../stores/authStore'
import { useUserStore } from '../../../stores/userStore'

export function useCruduser() {
    const [fullName, setFullName] = useState('')
    const [nombreEmpresa, setNombreEmpresa] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const { signupu } = useAuthStore()
    const { userData } = useUserStore()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')

        const nombreEmpresa = userData?.nombreEmpresa || ''

        // Validaciones
        if (!fullName.trim()) {
            setError('El nombre completo es requerido')
            return
        }
        if (!phone.trim()) {
            setError('El número de teléfono es requerido')
            return
        }

        if (password !== confirmPassword) {
            setError('Las contrase�as no coinciden')
            return
        }

        if (password.length < 6) {
            setError('La contrase�a debe tener al menos 6 caracteres')
            return
        }


        setLoading(true)

        try {
            const result = await signupu(email, password, fullName, nombreEmpresa, phone)

            if (!result.success) {
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