import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import { useUserStore } from './userStore'
import type { User } from '@supabase/supabase-js'
import type { QueryClient } from '@tanstack/react-query'

let queryClientRef: QueryClient | null = null

export const setQueryClientRef = (client: QueryClient) => {
    queryClientRef = client
    console.log('✅ QueryClient registrado en authStore')
}

interface AuthState {
    user: User | null
    session: any | null
    loading: boolean

    // Actions
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    signup: (email: string, password: string, fullName?: string, nombreEmpresa?: string, phone?: string) => Promise<{ success: boolean; error?: string }>
    signupu: (email: string, password: string, fullName?: string, nombreEmpresa?: string, phone?: string, createdBy?: string) => Promise<{ success: boolean; error?: string }>
    logout: () => Promise<void>
    checkAuth: () => Promise<void>
    changePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>
    resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            session: null,
            loading: true,

            login: async (email: string, password: string) => {
                try {
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    })

                    if (error) throw error

                    set({
                        user: data.user,
                        session: data.session,
                        loading: false,
                    })

                    // ✅ Cargar datos del usuario después del login
                    await useUserStore.getState().loadUserData()

                    return { success: true }
                } catch (error: any) {
                    set({ loading: false })
                    return {
                        success: false,
                        error: error.message || 'Error al iniciar sesión',
                    }
                }
            },

            signup: async (email: string, password: string, fullName?: string, nombreEmpresa?: string, phone?: string) => {
                try {
                    const { data, error } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            data: {
                                full_name: fullName,
                                nombre_empresa: nombreEmpresa,
                                phone: phone,
                                role: 'admin',
                            },
                        },
                    })

                    if (error) throw error

                    set({
                        user: data.user,
                        session: data.session,
                        loading: false,
                    })

                    return { success: true }
                } catch (error: any) {
                    set({ loading: false })
                    return {
                        success: false,
                        error: error.message || 'Error al registrarse',
                    }
                }
            },

            signupu: async (email: string, password: string, fullName?: string, nombreEmpresa?: string, phone?: string, createdBy?: string) => {
                try {
                    const { data, error } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            data: {
                                full_name: fullName,
                                nombre_empresa: nombreEmpresa,
                                phone: phone,
                                role: 'user',
                                created_by: createdBy,
                            },
                        },
                    })

                    if (error) throw error

                    set({
                        user: data.user,
                        session: data.session,
                        loading: false,
                    })

                    return { success: true }
                } catch (error: any) {
                    set({ loading: false })
                    return {
                        success: false,
                        error: error.message || 'Error al registrarse',
                    }
                }
            },

            logout: async () => {
                try {
                    console.log('🧹 Iniciando logout...')
                    
                    // ✅ 1. Cerrar sesión en Supabase
                    await supabase.auth.signOut()
                    
                    // ✅ 2. Limpiar auth store
                    set({ user: null, session: null })

                    if (queryClientRef) {
                        queryClientRef.clear()
                        console.log('🧹 Cache de React Query limpiada')
                    } else {
                        console.warn('⚠️ QueryClient no registrado')
                    }

                    localStorage.removeItem('REACT_QUERY_OFFLINE_CACHE')

                    useUserStore.getState().clearUserData()

                    localStorage.clear()
                    sessionStorage.clear()

                    console.log('✅ Logout completado')
                    
                    window.location.href = '/login'
                } catch (error) {
                    console.error('❌ Logout error:', error)
                }
            },

            checkAuth: async () => {
                try {
                    const { data: { session } } = await supabase.auth.getSession()

                    set({
                        user: session?.user ?? null,
                        session: session,
                        loading: false,
                    })

                    if (session?.user) {
                        await useUserStore.getState().loadUserData()
                    }
                } catch (error) {
                    console.error('Error checking auth:', error)
                    set({ loading: false })
                }
            },

            changePassword: async (newPassword: string) => {
                try {
                    const { error } = await supabase.auth.updateUser({
                        password: newPassword,
                    })

                    if (error) throw error

                    return { success: true }
                } catch (error: any) {
                    return {
                        success: false,
                        error: error.message || 'Error al cambiar la contraseña',
                    }
                }
            },

            resetPassword: async (email: string) => {
                try {
                    const { error } = await supabase.auth.resetPasswordForEmail(email)

                    if (error) throw error

                    return { success: true }
                } catch (error: any) {
                    return {
                        success: false,
                        error: error.message || 'Error al enviar correo de recuperación',
                    }
                }
            },
        }),
        {
            name: 'auth-storage',
        }
    )
)