import axios from 'axios'
import { supabase } from '../lib/supabase'

const getApiUrl = () => {
    const url = import.meta.env.VITE_API_URL ?? window.__env?.VITE_API_URL

    if (!url) {
        console.error('❌ VITE_API_URL no está definido en las variables de entorno')
        throw new Error('VITE_API_URL no está configurado')
    }

    return url.endsWith('/api') ? url : `${url}/api`
}

const API_URL = getApiUrl()
// Cliente de Axios con interceptor para JWT
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Interceptor para agregar el JWT automáticamente
apiClient.interceptors.request.use(
    async (config) => {
        try {
            // Obtener la sesión actual de Supabase
            const { data: { session }, error } = await supabase.auth.getSession()

            if (error) {
                console.error('❌ Error obteniendo sesión:', error)
                return config
            }

            if (session?.access_token) {
                // Agregar el token Bearer
                config.headers.Authorization = `Bearer ${session.access_token}`
                console.log('✅ Token agregado al request')
            } else {
                console.warn('⚠️ No hay token disponible')
            }

            return config
        } catch (error) {
            console.error('❌ Error en interceptor:', error)
            return config
        }
    },
    (error) => {
        console.error('❌ Error en request interceptor:', error)
        return Promise.reject(error)
    }
)

// Interceptor para manejar errores
apiClient.interceptors.response.use(
    (response) => {
        console.log(`✅ Response ${response.status} de ${response.config.url}`)
        return response
    },
    (error) => {
        console.error('❌ Error en response:', error.response?.status, error.response?.data)

        if (error.response?.status === 401) {
            console.error('🚫 No autorizado - Token inválido o expirado')
            // Opcional: redirigir a login
            // window.location.href = '/login'
        }

        return Promise.reject(error)
    }
)

export interface UserDto {
    id: string
    email: string
    fullName?: string
    role: 'superadmin' | 'admin' | 'user'
    createdAt: string
}

export const userService = {
    // Obtener usuario actual
    getCurrentUser: async (): Promise<UserDto> => {
        console.log('🔍 Obteniendo usuario actual.. .')
        const { data } = await apiClient.get<UserDto>('/users/me')
        console.log('✅ Usuario obtenido:', data)
        return data
    },

    // Obtener todos los usuarios (solo admin/superadmin)
    getAllUsers: async (): Promise<UserDto[]> => {
        console.log('🔍 Obteniendo todos los usuarios...')
        const { data } = await apiClient.get<UserDto[]>('/users')
        console.log(`✅ ${data.length} usuarios obtenidos`)
        return data
    },

    // Eliminar usuario (solo superadmin)
    deleteUser: async (userId: string): Promise<void> => {
        console.log(`🗑️ Eliminando usuario ${userId}...`)
        await apiClient.delete(`/users/${userId}`)
        console.log('✅ Usuario eliminado')
    }
}