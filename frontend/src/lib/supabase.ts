import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zyzmaaeoutsfstapbgmc.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_LMCPeGJlx-MyhjKVHq1New_9nhbxjAB'

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