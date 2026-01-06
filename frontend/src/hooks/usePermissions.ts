import { useUserStore } from '../stores/userStore'
import { UserPermissions } from '../types/user.types'

export function usePermissions() {
    const { userData, hasAccess, permissionsLoaded, permissionsLoading } = useUserStore()

    return {
        role: userData?.role || null,
        loading: permissionsLoading || !permissionsLoaded,
        loaded: permissionsLoaded,

        isSuperAdmin: userData?.role === 'superadmin',
        isAdmin: userData?.role === 'admin',
        isUser: userData?.role === 'user',

        hasAccess: (module: keyof UserPermissions) => hasAccess(module),

        userData,
    }
}