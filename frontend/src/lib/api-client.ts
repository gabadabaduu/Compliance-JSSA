import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { supabase } from './supabase'

const getApiUrl = () => {
    const url = import.meta.env.VITE_API_URL ?? window.__env?.VITE_API_URL

    if (!url) {
        return '/api'
    }

    if (typeof window !== 'undefined' && url.includes(window.location.hostname)) {
        return '/api'
    }

    // Para desarrollo local, usar la URL completa
    return url.endsWith('/api') ? url : `${url}/api`
}

const API_URL = getApiUrl()

// Cliente de Axios con interceptor para JWT
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Interceptor para agregar el JWT automáticamente
axiosInstance.interceptors.request.use(
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
axiosInstance.interceptors.response.use(
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

async function request<T>(config: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.request(config)
    return response.data
}

export const apiClient = {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
        request<T>({ ...config, method: 'GET', url }),

    post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
        request<T>({ ...config, method: 'POST', url, data }),

    put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
        request<T>({ ...config, method: 'PUT', url, data }),

    delete: <T>(url: string, config?: AxiosRequestConfig) =>
        request<T>({ ...config, method: 'DELETE', url }),
}