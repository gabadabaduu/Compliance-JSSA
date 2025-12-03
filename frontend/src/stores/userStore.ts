import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient } from '../lib/api-client'
import { UserDto, UserPermissions } from '../types/user.types'

interface UserState {
    userData: UserDto | null
    permissionsLoading: boolean
    permissionsLoaded: boolean

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

            loadUserData: async (forceReload = false) => {
                // Si forceReload es true, ignorar el estado actual y recargar
                if (!forceReload && (get().permissionsLoading || get().permissionsLoaded)) {
                    return
                }

                set({ permissionsLoading: true })

                try {
                    const data = await apiClient.get<UserDto>('/users/me')
                    set({
                        userData: data,
                        permissionsLoading: false,
                        permissionsLoaded: true
                    })
                } catch (error) {
                    console.error('Error loading user data:', error)
                    set({
                        userData: null,
                        permissionsLoading: false,
                        permissionsLoaded: false
                    })
                }
            },

            clearUserData: () => {
                set({
                    userData: null,
                    permissionsLoading: false,
                    permissionsLoaded: false
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
        }
    )
)