import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY no están definidas. Configura las env vars en Render.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
})

// Types para TypeScript
export type User = {
    id: string
    email: string
    created_at: string
}

export type Session = {
    access_token: string
    refresh_token: string
    user: User
}