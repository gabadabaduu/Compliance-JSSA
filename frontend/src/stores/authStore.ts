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

      signup: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          })

          if (error) throw error

          set({ user: data.user, session: data.session })
          return { success: true }
        } catch (error: any) {
          console.error('Signup error:', error)
          return { success: false, error: error.message }
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