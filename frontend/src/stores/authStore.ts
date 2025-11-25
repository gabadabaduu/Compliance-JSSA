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
  signup: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
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

          set({ user: data.user, session: data.session })
          return { success: true }
        } catch (error: any) {
          console.error('Login error:', error)
          return { success: false, error: error.message }
        }
      },

          signup: async (email: string, password: string, fullName?: string) => {
              try {
                  const { data, error } = await supabase.auth.signUp({
                      email,
                      password,
                      options: {
                          data: {
                              full_name: fullName || '',
                              role: 'user' // Todos empiezan como 'user'
                          }
                      }
                  })

                  if (error) throw error

                  set({ user: data.user, session: data.session })
                  return { success: true }
              } catch (error: any) {
                  console.error('Signup error:', error)
                  return { success: false, error: error.message }
              }
          },
          // Cambiar contraseña (usuario logueado)
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

          // Recuperar contraseña (olvidó su password)
          resetPassword: async (email: string) => {
              try {
                  const { error } = await supabase.auth.resetPasswordForEmail(email, {
                      redirectTo: 'http://localhost:5173/reset-password'
                  })

                  if (error) throw error

                  return { success: true }
              } catch (error: any) {
                  console.error('Reset password error:', error)
                  return { success: false, error: error.message }
              }
          },

          getUserRole: async () => {
              try {
                  const { data: { user } } = await supabase.auth.getUser()

                  if (!user) return null

                  const { data, error } = await supabase
                      .from('users')
                      .select('role')
                      .eq('id', user.id)
                      .single()

                  if (error) throw error

                  return data.role
              } catch (error) {
                  console.error('Get role error:', error)
                  return null
              }
          },

      logout: async () => {
        await supabase.auth.signOut()
        set({ user: null, session: null })
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
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        session: state.session 
      })
    }
  )
)