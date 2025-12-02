import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthState {
    user: User | null
    session: any | null
    loading: boolean

    // Actions
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    signup: (email: string, password: string, fullName?: string, nombreEmpresa?: string) => Promise<{ success: boolean; error?: string }>
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

                    set({ user: data.user, session: data.session, loading: false })
                    return { success: true }
                } catch (error: any) {
                    console.error('Login error:', error)
                    return { success: false, error: error.message }
                }
            },

            signup: async (email: string, password: string, fullName?: string, nombreEmpresa?: string) => {
                try {
                    const { data, error } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            data: {
                                full_name: fullName || '',
                                nombre_empresa: nombreEmpresa || '',
                                role: 'admin'
                            }
                        }
                    })

                    if (error) throw error

                    set({ user: data.user, session: data.session, loading: false })
                    return { success: true }
                } catch (error: any) {
                    console.error('Signup error:', error)
                    return { success: false, error: error.message }
                }
            },

            logout: async () => {
                try {
                    await supabase.auth.signOut()
                    set({ user: null, session: null })
                } catch (error) {
                    console.error('Logout error:', error)
                }
            },

            checkAuth: async () => {
                try {
                    const { data: { session } } = await supabase.auth.getSession()
                    set({ user: session?.user || null, session, loading: false })
                } catch (error) {
                    console.error('Check auth error:', error)
                    set({ user: null, session: null, loading: false })
                }
            },

            changePassword: async (newPassword: string) => {
                try {
                    const { error } = await supabase.auth.updateUser({
                        password: newPassword
                    })

                    if (error) throw error

                    return { success: true }
                } catch (error: any) {
                    console.error('Change password error:', error)
                    return { success: false, error: error.message }
                }
            },

            resetPassword: async (email: string) => {
                try {
                    const { error } = await supabase.auth.resetPasswordForEmail(email, {
                        redirectTo: `${window.location.origin}/reset-password`
                    })

                    if (error) throw error

                    return { success: true }
                } catch (error: any) {
                    console.error('Reset password error:', error)
                    return { success: false, error: error.message }
                }
            },
        }),
        {
            name: 'auth-storage',
        }
    )
)