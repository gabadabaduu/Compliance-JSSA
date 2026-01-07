// Tipos de usuario - Compartidos por toda la aplicación

export type UserRole = 'superadmin' | 'admin' | 'user'

export interface UserDto {
    id: string
    email: string
    fullName?: string
    role: UserRole
    nombreEmpresa?: string
    accessDashboard: boolean
    accessEpid: boolean
    accessRat: boolean
    accessNormograma: boolean
    accessHabeasdata: boolean
    accessMatrizriesgo: boolean
    accessAjustes: boolean
    accessUsuario: boolean
    createdAt: string
    updatedAt?: string
    updatedBy?: string 
}

export interface UserPermissions {
    accessDashboard: boolean
    accessEpid: boolean
    accessRat: boolean
    accessNormograma: boolean
    accessHabeasdata: boolean
    accessMatrizriesgo: boolean
    accessAjustes: boolean
    accessUsuario: boolean
}