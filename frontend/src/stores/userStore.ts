import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient } from '../lib/api-client'
import { UserDto, UserPermissions } from '../types/user.types'

interface UserState {
    userData: UserDto | null
    permissionsLoading: boolean
    permissionsLoaded: boolean
    lastLoadedAt: number | null

    loadUserData: (forceReload?: boolean) => Promise<void>
    clearUserData: () => void
    hasAccess: (module: keyof UserPermissions) => boolean
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            userData: null,
            permissionsLoading: false,
            permissionsLoaded: false,
            lastLoadedAt: null,

            loadUserData: async (forceReload = false) => {
                const state = get()

                // ✅ Verificar si los datos son recientes (menos de 5 minutos)
                const isStale = state.lastLoadedAt
                    ? (Date.now() - state.lastLoadedAt) > 300000  // 5 minutos
                    : true

                if (!forceReload && !isStale && state.permissionsLoaded && state.userData) {
                    console.log('✅ Permisos ya cargados - usando cache')
                    return
                }

                // ✅ Evitar llamadas duplicadas
                if (state.permissionsLoading) {
                    console.log('⏳ Ya se están cargando permisos - esperando.. .')
                    return
                }

                set({ permissionsLoading: true })

                try {
                    console.log('📡 Cargando datos de usuario desde API...')
                    const data = await apiClient.get<UserDto>('/users/me')
                    set({
                        userData: data,
                        permissionsLoading: false,
                        permissionsLoaded: true,
                        lastLoadedAt: Date.now()
                    })
                    console.log('✅ Permisos cargados correctamente:', data)
                } catch (error) {
                    console.error('❌ Error loading user data:', error)
                    set({
                        userData: null,
                        permissionsLoading: false,
                        permissionsLoaded: false,
                        lastLoadedAt: null
                    })
                }
            },

            clearUserData: () => {
                console.log('🧹 Limpiando datos de usuario...')
                set({
                    userData: null,
                    permissionsLoading: false,
                    permissionsLoaded: false,
                    lastLoadedAt: null
                })
            },

            hasAccess: (module: keyof UserPermissions) => {
                const { userData } = get()

                if (!userData) return false
                if (userData.role === 'superadmin') return true

                return userData[module] === true
            }
        }),
        {
            name: 'user-storage',
            // ✅ FIX:  Usar partialize para solo persistir lo necesario
            partialize: (state) => ({
                userData: state.userData,
                lastLoadedAt: state.lastLoadedAt,
                // NO persistimos permissionsLoading ni permissionsLoaded
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // ✅ FIX: Permitir que use los datos cacheados si son recientes
                    const isStale = state.lastLoadedAt
                        ? (Date.now() - state.lastLoadedAt) > 300000 // 5 minutos
                        : true

                    if (isStale) {
                        state.permissionsLoaded = false
                        state.lastLoadedAt = null
                        console.log('🔄 Store rehidratado - datos obsoletos, se recargarán')
                    } else {
                        state.permissionsLoaded = true
                        console.log('✅ Store rehidratado - usando datos en cache')
                    }
                }
            }
        }
    )
)