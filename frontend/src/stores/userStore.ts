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

                const isStale = state.lastLoadedAt
                    ? (Date.now() - state.lastLoadedAt) > 10000  // 10 segundos
                    : true

                if (!forceReload && !isStale && (state.permissionsLoading || state.permissionsLoaded)) {
                    return
                }

                if (state.permissionsLoading) {
                    return
                }

                set({ permissionsLoading: true })

                try {
                    const data = await apiClient.get<UserDto>('/users/me')
                    set({
                        userData: data,
                        permissionsLoading: false,
                        permissionsLoaded: true,
                        lastLoadedAt: Date.now()
                    })
                } catch (error) {
                    console.error('Error loading user data:', error)
                    set({
                        userData: null,
                        permissionsLoading: false,
                        permissionsLoaded: false,
                        lastLoadedAt: null
                    })
                }
            },

            clearUserData: () => {
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
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.permissionsLoaded = false
                    state.lastLoadedAt = null
                    console.log('🔄 Store rehidratado - permisos serán recargados')
                }
            }
        }
    )
)