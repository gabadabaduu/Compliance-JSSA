import { useState, useEffect } from 'react'
import { useAuthStore } from '../../../stores/authStore'
import { userService } from '../../../services/userService'

type UserRole = 'superadmin' | 'admin' | 'user' | null

export function useUserRole() {
    const { user } = useAuthStore()
    const [role, setRole] = useState<UserRole>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            setRole(null)
            setLoading(false)
            return
        }

        const fetchRole = async () => {
            try {
                // Consultar al BACKEND en lugar de Supabase directamente
                const userData = await userService.getCurrentUser()
                setRole(userData.role as UserRole)
            } catch (error) {
                console.error('Error fetching role:', error)
                setRole(null)
            } finally {
                setLoading(false)
            }
        }

        fetchRole()
    }, [user])

    return {
        role,
        loading,
        isSuperAdmin: role === 'superadmin',
        isAdmin: role === 'admin',
        isUser: role === 'user'
    }
}